$(function(){
	masonry(".masonry", 4);
	atip(".atip", 200);
	accordion(".accordion", "h6");
	agent();
	fakeFor();
	parallax();
			
	$('.modal-control').on({
		click:function(){
			$('.modal').fadeIn();	
		}
	});

	$('.modal').on({
		click:function(){
			$(this).fadeOut();	
		}
	});
	
	$('nav').on({
		click:function(){
			$(this).toggleClass("show");
		}
	});
});

function fakeFor(){
	var forObj = $('.for');
	if(forObj.length > 0){
		$.each(forObj, function(){
			var that = $(this);
			var thatValue = that.html();
			var fakeArr = thatValue.split(",");
			that.empty();
			for(var i=1; i<fakeArr.length; i++){
				fakeDom = fakeArr[0].replace(/^\s/, "");
				fakeArrVal = fakeArr[i].replace(/^\s/, "");
				if( fakeDom === "option" ){
					newDom = '<' + fakeDom + ' value="' + fakeArrVal + '">' + fakeArrVal + '</' + fakeDom + '>';
				} else if( fakeDom === "checkbox"){
					newDom = '<label for="' + fakeDom + i + '"><input id="' + fakeDom + i + '" type="' + fakeDom + '" value="' + fakeArrVal + '" />' + fakeArrVal + '</label>';
				} else if( fakeDom === "radio" ){
					newDom = '<label for="' + fakeDom + i + '"><input id="' + fakeDom + i + '" name="forloop-radio" type="' + fakeDom + '" value="' + fakeArrVal + '" />' + fakeArrVal + '</label>';
				} else {
					newDom = '<' + fakeDom + ' class="' + fakeArrVal + '">' + fakeArrVal + '</' + fakeDom + '>';
				}
				that.append(newDom);
			}
		});
	}
}

function atip(el, width){
	var elem = $(el);
	var arr = [];
	$.each(elem, function(i){
		var that = $(this);
		var tip = that.html();
		var wrap = '<div class="w' + width + '">' + tip + '</div>';
		arr.push(wrap);
		that.empty().on({
			mouseenter:function(){
				that.append(arr[i]);
			},
			mouseleave:function(){
				that.empty();
			},
			click:function(e){
				e.preventDefault();
			}
		});
	});
}

function masonry(el, count, biggie){
	var elem = $(el);
	var blocks = elem.find("p");	
	var columns = "";
	var col = [];
	for(var i = 0; i <= (count - 1); i++){
		if(biggie){
			if(i === 0) {
				blockCount = biggie;
			} else {
				blockCount = (12 - biggie) / (count - 1);
			}
		} else {
			var blockCount = 12/count;
		}
		col.push("col" + (i + 1));
		columns += '<div class="column' + blockCount + ' ' + col[i] + '" />';
	}
	elem.prepend(columns);
	$.each(blocks, function(a){
		var that = $(this);
		var a = a + 1;
		var place = a % count;
		var colNum = place > 0 ? place - 1 : count - 1;
		that.append("<span>Block" + a + "</span>");
		elem.find("." + col[colNum]).append(that);
	});
}

function accordion(el){
	var elem = $(el);
	$.each(elem, function(){
		var dl = $(this);
		var dd = dl.find('dd');
		var tabbed = dl.is('.tabbed') ? 1 : 0;
		
		if(!tabbed){
			var dt = dl.find('dt');
		} else {
			var dtArr = [];
			var tabbedAfter = dl.is('.after') ? 1 : 0;
			if(tabbedAfter){
				dl.append('<div class="control" />');
			} else {
				dl.prepend('<div class="control" />');
			}
			$.each(dl.find("dt"), function(){
				var tempDt = $(this).html();
				$(this).remove();
				dtArr.push(tempDt);
			});
			
			for(var i=0; i<dtArr.length; i++){
				var firstClass = i === 0 ? "active": "";
				dl.find('.control').append('<span class="' + firstClass + '">' + dtArr[i] + '</span>');
			}
			var dt = dl.find('.control').find('span');
		}
		
		dl.find("dd:first").slideDown();
		$(dt[0]).addClass('active');
		
		$.each(dd, function(i){
			var that = $(this);
			$(dt[i]).on({
				click:function(e){
					e.preventDefault();
					var status = $(this).attr('class');
					if(status === "active"){
						// Do nothing
					} else {
						dl.find('.active').removeClass('active');
						$(this).addClass("active");
						dd.slideUp();
						that.slideDown();
					}
				}
			});
		});
	});
}

function agent(){
	var section = $('section');
	var sectionPos = section.offset().top;
	var spyObj = section.find('article');
	var spyMenu = section.find('.spy');
	var spyObjs = [];
		
	$.each(spyObj, function(i){
		var that = $(this);
		spyObjs.push(that.offset().top);
		spyMenu.append('<a href="#">' + that.attr('class') + '</a>');
	});
	
	var spyMenuObj = spyMenu.find('a');
	$.each(spyMenuObj, function(i){
		var that = $(this);
		that.on({
			click:function(e){
				e.preventDefault();
				$('html, body').animate({
					scrollTop: spyObjs[i] - 50
				}, 500);
			}
		});
	});
	
	$(window).on({
		scroll:function(){
			var winPos = window.pageYOffset;
			if(winPos > sectionPos) {
				spyMenu.slideDown();
				for(var i=0; i < spyObjs.length; i++) {
					if(i !== spyObjs.length - 1) {
						var bottomStop = spyObjs[i + 1] - 100;
					} else {
						var bottomStop = spyObjs[i] + $(spyObj[3]).innerHeight();
					}
					if(winPos > spyObjs[i] - 100 && winPos < bottomStop) {
						$(spyMenuObj[i]).addClass("active");
					} else {
						$(spyMenuObj[i]).removeClass("active");
					}
				}
			} else {
				spyMenu.hide();
			}
		}
	});
}

function parallax(el) {
	var bg = $('[class*="parallax"]');
	$.each(bg, function(i) {
		var that = $(this);
		var currentPos = that.offset().top;
		$(window).on({
			scroll:function(){
				var winPos = window.pageYOffset;
				var height = that.innerHeight();
				if(winPos > currentPos && winPos < currentPos + height) {
					var speed = Math.floor((winPos - currentPos) / 1.5) + "px";
				} else {
					var speed = 0;
				}
				that.css({
					backgroundPosition: "center " + speed
				});		
			}
		});
	});
}

function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
		else var expires = "";
		document.cookie = name+"="+value+expires+"; path=/";
}
function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
	var c = ca[i];
	while (c.charAt(0)==' ') c = c.substring(1,c.length);
	if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
	}
	
function eraseCookie(name) {
	createCookie(name,"",-1);
} 