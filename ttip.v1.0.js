/*-------------------------------------------------------*/
/** Created by: Raymund Tuquero, Aleph: 12/01/2011
/**	Plugin	  : Tooltip Plugin V.01
/**	Version	  : v.01
------------------------------------------------------ ***/
(function ($) {
    $.fn.tooltip = function(options){
		var defaults = {
			title : '',
			zIndex: '3500',
			offset : '',
			color: 'yellow',
			arrowPosition: 'bottom-left',
			arrowClass : 'tip-arrow',
			trigger: ['hover'],
			tipCloseClass: '.tipClose',
			icon: false,
			iconClass : 'tip-icon',
			width: '120',
			btnClose: false,
			fxCallBack: false,
			onTipShow : false,
			onTipHide : false
		};
		var opts = $.extend(defaults, options);
		return this.each(function() {
			tipIconId = 'tip' + new Date().getTime();			//generate Icon ID/tip class
			$(this).attr('id', tipIconId);						// Add ID to Icon
			opts.tipClass = tipIconId;
			
			// Create ToolTip	
			createToolTip( $(this), opts, tipIconId );
		
			// Bind Event:
			bindEvents( opts.trigger, $(this), opts );
			
			if( $.isFunction(opts.fxCallBack) ){
				opts.fxCallBack.call( $(this) );
			}

		});
};

$.fn.tooltipClose = function() {$(this).stop(true, true).delay(200).fadeOut(); };

	var flag = 0;

	var createToolTip = function($this, opts, classId){
		
		$title = ( opts.title!='' ) ? opts.title : $this.attr('title');		// If not title Specified get element title attribute
		$this.removeAttr('title');
		
		// Create tooltip Elements
		$tipWrap = $('<div class="tooltip" />');
		$tipBtnClose = $('<span class="tip-btn-close" />');
		$tipIcon = $('<span />').addClass(opts.iconClass);
		$tipArrow = $('<span/>').addClass(opts.arrowClass);
		
		// Element ID
		$tipWrap.addClass(classId);
		
		// Enable Icon
		wrapperStyle($tipWrap, opts);
		if(opts.icon==true) addIcon($tipWrap, $tipIcon, opts);
		
		// Get Tip Color
		arrowColor($tipArrow, opts);

		// Enable Close Button
		if( opts.btnClose==true ) tipBtnClose($tipWrap);

		// Append Elements	
		$tipWrap.append($tipIcon);
		$tipWrap.append($tipArrow);
		$tipWrap.append($title);		
		
		// assign Z-index
		$tipWrap.css({zIndex:opts.zIndex});
		
		// tooltip Events
		$tipWrap.hover(
			function(){ flag=1; },
			function(){ flag=0; }
		)
		
		// Append To Body
		$('body').append($tipWrap);
		
		// Get Tip Position
		//arrowPosition($tipWrap, $tipArrow, opts);
		
		setCloseClass(opts);
	}

	var bindEvents = function(events, o, opt){
		var $id = o.attr('id');
		var $tip = $('.' + $id);
		$.each(events, function(i, v){
			if ( v == 'hover' ){
				o.bind('mouseover mouseout', function(event) {
					if (event.type == 'mouseover') {					
						showTooltip( $tip, $(this), opt );
					} else {
						hideTooltip( $tip, $(this), opt );
					}
				});
			}else if ( v == 'click' ){
				o.bind({
					click : function(e){
						if( e.currentTarget===this && $tip.css('display')=='none'){
							showTooltip( $tip, $(this), opt );								
						}
					},
					blur : function(e){
						hideTooltip( $tip, $(this), opt );
					}
				});
				$tip.bind({
					mouseover : function(e){
						e.stopImmediatePropagation();
					}
				});
			}else if ( v == 'blur' ){
				o.bind('blur', function() {
					if( o.attr('type')=='text' ){
						hideTooltip( $tip, opt );	
					}
				})
			}else if ( v == 'onload' ){
                showTooltip( $tip, o, opt );
            }
		})
	};
	
	var showTooltip = function(tooltip, curTooltip, opt){
		$('.tooltip').hide();
		if ( $.isFunction(opt.onTipShow) ){
			opt.onTipShow.call(opt, tooltip);
			$tipArrow = tooltip.find('.' + opt.arrowClass);		
			arrowPosition(tooltip, $tipArrow, opt);				// Assign Tooltip arrow
			tipPosition( tooltip, curTooltip, opt );			// Assign Tooltip Position
			tooltip.stop(true, true).delay(200).fadeIn();
			return tooltip;
		}else{
			$tipArrow = tooltip.find('.' + opt.arrowClass);		
			arrowPosition(tooltip, $tipArrow, opt);				// Assign Tooltip arrow
			tipPosition( tooltip, curTooltip, opt );			// Assign Tooltip Position		
			tooltip.stop(true, true).delay(200).fadeIn();
		}
	};

	var hideTooltip = function(tooltip, opt){
		if ( $.isFunction(opt.onTipHide) ){
			opt.onTipHide.call( this );
			tooltip.stop(true, true).delay(200).fadeOut();
			return tooltip;
		}else{
			tooltip.stop(true, true).delay(200).fadeOut();
		}
	};	

	var setCloseClass = function(opt){
		$(opt.tipCloseClass).live('click',function(){
			$('.tooltip').hide();
		})
	}

	var tipBtnClose = function($tooltip){
		$btnClose = '<input type="image" class="jqmdX jqmClose" src="dialog/close.gif" />';
		$tooltip.append( $btnClose );
		$('.jqmClose').live("click", function(){
			$(this).parent().fadeOut();
		})
	}	
	
	var wrapperStyle = function(tooltip, opt){
		tooltip.css({minimumWidth:'120px', width:opt.width});
		if(opt.color=='grey') tooltip.css({backgroundColor:'#222',border:'1px solid #222', color:'#fff'});
		if(opt.color=='yellow') tooltip.css({backgroundColor:'#f9f7d7', border:'1px solid #d9ce5c', color:'#807a20'});
		if(opt.color=='white') tooltip.css({backgroundColor:'#f1f1f1', border:'1px solid #afafaf', color:'#666666'});
		if(opt.color=='red') tooltip.css({backgroundColor:'#c33',border:'1px solid #f00', color:'#fff'});
	};
	
	var addIcon = function(tooltip, icon, opt){
		tooltip.css({paddingLeft:'35px'});
		if(opt.color=='grey') icon.css({backgroundPosition: '-5px -165px'});
		if(opt.color=='yellow') icon.css({backgroundPosition: '-35px -165px'});
		if(opt.color=='white') icon.css({backgroundPosition: '-70px -165px'});
		if(opt.color=='red') icon.css({backgroundPosition: '-105px -165px'});
	};

	var arrowColor = function(arrow, opt){
		if(opt.arrowPosition=='bottom-left' || opt.arrowPosition=='bottom-right'){
			//bottom
			if(opt.color=='grey') arrow.css({backgroundPosition: '0 -23px'});
			if(opt.color=='yellow') arrow.css({backgroundPosition: '0 -84px'});
			if(opt.color=='white') arrow.css({backgroundPosition: '0 -155px'});
			if(opt.color=='red') arrow.css({backgroundPosition: '0 -279px'});
		}else if(opt.arrowPosition=='left-middle'){
			//left
			arrow.css({height:'30px'});
			if(opt.color=='grey') arrow.css({backgroundPosition: '19px -34px'});
			if(opt.color=='yellow') arrow.css({backgroundPosition: '18px -95px'});
			if(opt.color=='white') arrow.css({backgroundPosition: '18px -160px'});
			if(opt.color=='red') arrow.css({backgroundPosition: '18px -290px'});
		}else if(opt.arrowPosition=='right-middle'){
			//left
			arrow.css({height:'30px'});
			if(opt.color=='grey') arrow.css({backgroundPosition: '-20px -34px'});
			if(opt.color=='yellow') arrow.css({backgroundPosition: '-19px -95px'});
			if(opt.color=='white') arrow.css({backgroundPosition: '-18px -160px'});
			if(opt.color=='red') arrow.css({backgroundPosition: '-18px -290px'});
		}
	};		
	
	var arrowPosition = function(tooltip, arrow, opt){
		if(opt.arrowPosition=='bottom-left') arrow.css({bottom:'-10px', left:'10px'});
		if(opt.arrowPosition=='bottom-right') arrow.css({bottom:'-10px', right:'10px'});
		
		yTop = $(tooltip).show().height()/2;
		if(opt.arrowPosition=='left-middle') arrow.css({top:yTop, left:'-30px'});
		if(opt.arrowPosition=='right-middle') arrow.css({top:yTop, right:'-30px'});
	};
	
	var tipPosition = function(tooltip, icon, opt){
		yPos = icon.offset().top;
		xPos = icon.offset().left;
		
		// apply HEIGHT offset arrowPosition BOTTOM :: top:-30
		yPos = yPos - tooltip.height();
		
		// apply TOP offset on arrowPosition BOTTOM :: top:-30
		yPos = ( opt.arrowPosition=='bottom-right' || opt.arrowPosition=='bottom-left' ) ? yPos -30 : yPos;	
		
		//apply LEFT offset on arrowPosition LEFT
		xPos = ( opt.arrowPosition=='bottom-left' ) ? xPos - 28 : xPos;
		
		//apply WIDTH offset on arrowPosition LEFT
		xPos = ( opt.arrowPosition=='bottom-left' ) ? xPos + (icon.width()/2) : xPos;
		
		//apply WIDTH offset on arrowPosition RIGHT
		xPos = ( opt.arrowPosition=='bottom-right' ) ? xPos - tooltip.width() : xPos;
		
		//apply RIGHT offset on arrowPosition RIGHT
		xPos = ( opt.arrowPosition=='bottom-right' ) ? xPos + (icon.width()/2): xPos;
		
		//apply TOP offset on arrowPosition MIDDLE
		yPos = ( opt.arrowPosition=='left-middle' || opt.arrowPosition=='right-middle' ) ? yPos + (tooltip.height()/2) - 10: yPos;
		
		//apply LEFT offset on arrowPosition LEFT MIDDLE
		xPos = ( opt.arrowPosition=='left-middle' ) ? xPos + (icon.width() + 10): xPos;
		
		//apply LEFT offset on arrowPosition RIGHT MIDDLE
		xPos = ( opt.arrowPosition=='right-middle' ) ? xPos - tooltip.width() : xPos;
		
		// apply custom offset ::: default offset : {left:-20, top: -30},
		if( opt.offset!='' ){
		
			yPos = yPos + opt.offset.top;
			xPos = xPos + opt.offset.left;
		}
		
		tooltip.css({top:yPos, left:xPos});
	};	
	
})(jQuery);