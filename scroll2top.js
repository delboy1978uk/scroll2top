/**
 *   _________                   .__  .__   ___________________
 * /   _____/ ___________  ____ |  | |  |  \_____  \__    ___/___ ______
 * \_____  \_/ ___\_  __ \/  _ \|  | |  |   /  ____/ |    | /  _ \\____ \
 * /        \  \___|  | \(  <_> )  |_|  |__/       \ |    |(  <_> )  |_> >
 * /_______  /\___  >__|   \____/|____/____/\_______ \|____| \____/|   __/
 *         \/     \/                                \/             |__|
 *
 * Created by delboy1978uk on 27/05/15.
 * Taken and packaged up from some (messy) code (now tidied!) found on a StackOverflow post!
 */



var scroll2top=
{
    setting:
    {
        startline:100,
        scrollto: 0,
        scrollduration:1000,
        fadeduration:[500, 100]
    },

    controlHTML: '<img src="http://i.snag.gy/B3dPL.jpg" />', //HTML for control, which is auto wrapped in DIV w/ ID="topcontrol"

    controlattrs: //offset of control relative to right/ bottom of window corner
    {
        offsetx:5,
        offsety:5
    },

    anchorkeyword: '#top', //Enter href value of HTML anchors on the page that should also act as "Scroll Up" links

    state:
    {
        isvisible:false,
        shouldvisible:false
    },


    scrollup: function()
    {
        if (!this.cssfixedsupport) //if control is positioned using JavaScript
        {
            this.$control.css({opacity: 0}); //hide control immediately after clicking it
        }
        var dest = isNaN(this.setting.scrollto) ? this.setting.scrollto : parseInt(this.setting.scrollto);

        if (typeof dest=="string" && jQuery('#'+dest).length==1) //check element set by string exists
        {
            dest = jQuery('#' + dest).offset().top;
        }
        else
        {
            dest = 0;
        }
        this.$body.animate({scrollTop: dest}, this.setting.scrollduration);
    },


    keepfixed:function()
    {
        var $window=jQuery(window);

        var controlx=$window.scrollLeft() + $window.width() - this.$control.width() - this.controlattrs.offsetx;

        var controly=$window.scrollTop() + $window.height() - this.$control.height() - this.controlattrs.offsety;

        this.$control.css({
            left:controlx+'px',
            top:controly+'px'
        });
    },


    togglecontrol: function()
    {
        var scrolltop=jQuery(window).scrollTop();

        if (!this.cssfixedsupport)
        {
            this.keepfixed();
        }
        this.state.shouldvisible = scrolltop >= this.setting.startline;

        if (this.state.shouldvisible && !this.state.isvisible)
        {
            this.$control.stop().animate({opacity:1}, this.setting.fadeduration[0]);
            this.state.isvisible=true
        }
        else if (this.state.shouldvisible==false && this.state.isvisible)
        {
            this.$control.stop().animate({opacity:0}, this.setting.fadeduration[1]);
            this.state.isvisible=false;
        }
    },

    init: function()
    {
        jQuery(document).ready(function($)
        {
            var mainobj = scroll2top;
            var iebrws = document.all;

            mainobj.cssfixedsupport = !iebrws || iebrws && document.compatMode=="CSS1Compat" && window.XMLHttpRequest;//not IE or IE7+ browsers in standards mode
            mainobj.$body=(window.opera)? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body');
            mainobj.$control=$('<div id="topcontrol">'+mainobj.controlHTML+'</div>')
                .css({
                    position: mainobj.cssfixedsupport ? 'fixed' : 'absolute',
                    bottom: mainobj.controlattrs.offsety,
                    right: mainobj.controlattrs.offsetx,
                    opacity:0,
                    cursor:'pointer'
                })
                .attr({title:'Scroll to Top'})
                .click(function()
                {
                    mainobj.scrollup();
                    return false;
                })
                .appendTo('body');

            if (document.all && !window.XMLHttpRequest && mainobj.$control.text()!='') //loose check for IE6 and below, plus whether control contains any text
            {
                mainobj.$control.css({width: mainobj.$control.width()});//IE6- seems to require an explicit width on a DIV containing text
            }
            mainobj.togglecontrol();

            $('a[href="' + mainobj.anchorkeyword +'"]').click(function(){
                mainobj.scrollup();
                return false;
            });
            $(window).bind('scroll resize', function(e){
                mainobj.togglecontrol();
            });
        });
    }
};
scroll2top.init();
