


window.onload = changePage;
window.onhashchange = changePage;

$(window).on('load', removeLoadingScreen);

var skillset = {'c': '75%',
                'cpp': '85%',
                'cshrp': '50%',
                'java': '67%',
                'swift': '65%',
                'python': '85%',
                'sql': '60%',
                'html': '62%',
                'css': '62%',
                'js': '78%',
                'ui': '78%',
                'qt': '78%',
                'scikit': '20%',
                'regression': '25%',
                'classification': '60%',
                'clustering': '22%',
                'dimention': '20%',
                'website': '70%',
                'database': '80%'
                };
var skillBarMinWidth = '0%';

$(window).on('resize', function(){
  window.dispatchEvent(new Event('scroll'));
});


$(window).on('scroll', function(){
  var skillsVisible = false;
  Object.keys(skillset).forEach(function(key) { 
        var skillBar = $('.progress.' + key);
        if (checkVisible(skillBar[0])) skillsVisible = true;
  });
  if (skillsVisible){
    Object.keys(skillset).forEach(function(key) { 
        var skillBar = $('.progress.' + key);
        skillBar.css('width',skillset[key]);    
    })
  }
  else {
    Object.keys(skillset).forEach(function(key) { 
        var skillBar = $('.progress.' + key);
        skillBar.css('width',skillBarMinWidth);
    })   
  }
});

function showLoadingScreen(){
  $('#preloader').css("z-index", "99");
  $('#status').show();
  $('#preloader').show();
  $('.navbar-nav').addClass('hidden');
  $('.navbar-toggler').addClass('deleted');
}

function removeLoadingScreen(){ 
  $('#status').fadeOut(); 
  $('#preloader').delay(350).fadeOut('slow', function(){
      $('#preloader').css("z-index", "-1");
  });  
  $('body').delay(350).css({'overflow':'visible'});
  
  $('.navbar-nav').removeClass('hidden');
  $('.navbar-toggler').removeClass('deleted');

  window.dispatchEvent(new Event('resize'));

}


function changePage(){

	var hash = window.location.hash.substr(1);

  if (hash == '') hash = 'home';

	switch (hash) {
		case 'home':
      scrollToElement('body');
      $('#project-section').removeClass('hidden');
      $('#project-screen').addClass('hidden');
			break;
		case 'about':
      scrollToElement('#about-section');
			break;

		case 'skills':
      scrollToElement('#skills-section');
			break;

		case 'contact':
      scrollToElement('#project-section');
			break;

		case 'project':
      $('#project-section').removeClass('hidden');
      $('#project-screen').addClass('hidden');
      window.dispatchEvent(new Event('resize'));
      scrollToElement('#project-section');
			break;

		default:
      showLoadingScreen();
			showProject(hash);
			break;

	}
}

displayedProject = '';
function showProject(projectName){
  projectPath = './projects/' + projectName + ".html";
  var $projectScreen = $('#project-screen')

  $projectScreen.removeClass('hidden');
  $(document).ready(function(){
    $('#project-section').addClass('hidden');
    $projectScreen.empty();
    $projectScreen.load(projectPath +' #project-screen>*', function(){
      $('* *').imagesLoaded(function(){
        removeLoadingScreen();
        scrollToElement("#project-screen");
      });
    });
    
    
});
  
}

function checkVisible(elm) {
  var rect = elm.getBoundingClientRect();
  var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
  return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}


$(function () {
   $("img").not(":visible").each(function () {
       $(this).data("src", this.src);
       this.src = "";
   });

   var reveal = function (selector) {
       var img = $(selector);
       img[0].src = img.data("src");
   }
});

var $container = $('#project-section .row');
$container.imagesLoaded(function(){
  $container.masonry({
    itemSelector : '.col-xl-4',
    transitionDuration: '0.2s',
  });
});

function removeHash () { 
    window.dispatchEvent(new HashChangeEvent("hashchange"));
}
var navBarLength = 188;
function scrollToElement(element, duration = 500) { 
  var startingY = window.pageYOffset;
  var diff = (window.pageYOffset + document.querySelector(element).getBoundingClientRect().top) - startingY - navBarLength;
  var start;

  // Bootstrap our animation - it will get called right before next frame shall be rendered.
  window.requestAnimationFrame(function step(timestamp) {
    if (!start) start = timestamp;
    // Elapsed milliseconds since start of scrolling.
    var time = timestamp - start;
    // Get percent of completion in range [0, 1].
    var percent = Math.min(time / duration, 1);

    window.scrollTo(0, startingY + diff * percent);

    // Proceed with animation as long as we wanted it to.
    if (time < duration) {
      window.requestAnimationFrame(step);
    }
  })
}