$(window).on('load', function () {
    hash = window.location.hash.substr(1);
    if (hash !== '') {
        changePage(hash);
    }

    if (navigator.browserInfo.browser === 'Safari') {
        $('#navbar').addClass('safari');
    }

    setupGrid();
    removeLoadingScreen();

});

window.onpopstate = function (event) {
    changePage(window.location.hash.substr(1));
    window.dispatchEvent(new Event('scroll'));
};

$(window).on('resize', function () {
    if (this.resizeTO) clearTimeout(this.resizeTO);
    this.resizeTO = setTimeout(function () {
        $(this).trigger('resizeEnd');
    }, 300);

});


$(window).bind('resizeEnd', function () {
    window.dispatchEvent(new Event('scroll'));
});


$(window).on('scroll', function () {
    $('#project-section .row').masonry();
    var closestPage = getCurrentPage();
    skillBarSet();
});


var skillset = {
    'c': '75%',
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
    'database': '80%',
    'pytorch': '30%',
    'bootstrap': '55%'
};
var skillBarMinWidth = '1%';

function skillBarSet() {
    var skillsVisible = false;
    Object.keys(skillset).forEach(function (key) {
        var skillBar = $('.progress.' + key);
        if (checkVisible(skillBar[0])) {
            skillsVisible = true;
            return false;
        }
    });
    if (skillsVisible) {
        Object.keys(skillset).forEach(function (key) {
            var skillBar = $('.progress.' + key);
            skillBar.css('width', skillset[key]);
        })
    } else {
        Object.keys(skillset).forEach(function (key) {
            var skillBar = $('.progress.' + key);
            skillBar.css('width', skillBarMinWidth);
        })
    }
}

function showLoadingScreen() {
    var preloader = $('#preloader');
    preloader.css("z-index", "99");
    $('#status').show();
    preloader.show();
    $('.navbar-nav').addClass('hidden');
    $('.navbar-toggler').addClass('deleted');
}

function removeLoadingScreen() {
    $('#status').fadeOut();
    $('#preloader').delay(350).fadeOut('slow', function () {
        $('#preloader').css("z-index", "-1");
    });
    $('body').delay(350).css({'overflow': 'visible'});

    $('.navbar-nav').removeClass('hidden');
    $('.navbar-toggler').removeClass('deleted');

    window.dispatchEvent(new Event('resize'));

}

pageSections = new Set(['home', 'about', 'skills', 'contact', 'project']);

function changePage(pageName, updateHistory) {
    if(updateHistory === undefined) updateHistory = true;
    var prevPage = window.location.hash.substr(1);
    $('#project-section').removeClass('hidden');
    $('#project-screen').addClass('hidden');

    var hash = '#' + pageName;

    if (updateHistory) window.history.pushState('', document.title, hash);
    else window.history.replaceState('', document.title, hash);
    if (pageName === 'home') window.history.replaceState("", document.title, window.location.pathname + window.location.search);

    if (pageSections.has(pageName)) {
        var scrollElement = '#' + pageName + '-section';
        if (pageName === 'home' || '') scrollElement = 'body';
        scrollToElement(scrollElement);
    } else {
        showProject(pageName);
    }
}

function getCurrentPage() {
    var minDistance = 9999999;
    return null;
}

function showProject(projectName) {
    showLoadingScreen();
    projectPath = './projects/' + projectName + ".html";
    var $projectScreen = $('#project-screen');

    $projectScreen.removeClass('hidden');
    $(document).ready(function () {
        $('#project-section').addClass('hidden');
        $projectScreen.empty();
        $projectScreen.load(projectPath + ' #project-screen>*', function () {
            $('* *').imagesLoaded(function () {
                removeLoadingScreen();
                scrollToElement("#project-screen");

            });

        });
    });
}


function videoLoaded(vids, callback) {
    if (vids.length === 0) {
        callback();
    }
    var vidsLoaded = 0;
    vids.on('loadeddata', function () {
        vidsLoaded++;
        if (vids.length === vidsLoaded) {
            callback();
        }
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


function setupGrid() {
    var $container = $('#project-section .row');
    $container.imagesLoaded(function () {

        $container.masonry({
            itemSelector: '.col-xl-4',
            transitionDuration: '0.2s',
        });
    });


}


var navBarWidth = 188;
function distanceFromTop(element) {
    return (window.pageYOffset + document.querySelector(element).getBoundingClientRect().top) - startingY - navBarWidth;
}

function scrollToElement(element) {
    var duration = 500;
    var startingY = window.pageYOffset;
    var diff = distanceFromTop(element);
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

navigator.browserInfo = (function () {
    var ua = navigator.userAgent, tem,
        M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE ' + (tem[1] || '');
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
        if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
    return {'browser': M[0], 'version': M[1]};
})();
