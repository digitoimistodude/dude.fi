/*! dude 06-08-2018 15:09 - Digitoimisto Dude Oy (moro@dude.fi) */
!function(t){t(document).ready(function(){t(".number:not(.timefrom) .time span").each(function(){var m=moment(t(this).data("time")).fromNow();t(this).html(m)}),t(".number.timefrom .value").each(function(){var m=moment(t(this).data("time")).fromNow(!0);m=m.split(/(\s+)/),t(this).html(m[0]),t(this).parent().find(".label span").html(m[2]+" ")})})}(jQuery);