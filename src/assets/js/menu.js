const regexAnimateIcon = /https:\/\/cdn.discordapp.com\/icons\/\d{18}\/a_(.{32})\.png/gi;
const regexAnimateIcon2 = /https:\/\/cdn.discordapp.com\/icons\/\d{18}\/a_(.{32})\.gif/gi;
const regexAnimateAvatar = /https:\/\/cdn.discordapp.com\/avatars\/\d{18}\/a_(.{32})\.png/gi
const regexAnimateAvatar2 = /https:\/\/cdn.discordapp.com\/avatars\/\d{18}\/a_(.{32})\.gif/gi
const menu = $('#mobile__menu');

$(document).ready(function() {
    $('.nav_btn').click(function(){

        if(menu.hasClass("mobile__menu--active")) menu.removeClass("mobile__menu--active");
        else menu.addClass("mobile__menu--active");
    });

    $('.guild').hover(function() {
        const img = $(`.guild #guild__${this.id}`);
        const src = img.attr('src');
        if(regexAnimateIcon.test(src)) {
            return img.attr('src', src.replace(/png$/g, 'gif'));
        }
    }, function() {
        const img = $(`.guild #guild__${this.id}`);
        const src = img.attr('src');
        if(regexAnimateIcon2.test(src)) {
             return img.attr('src', src.replace(/gif$/g, 'png'));
        };
    });

    if(/^\/dashboard\/@me(.*?)/i.test(location.pathname)) $(".menu_guild_user_avatar").map(function(x) {
        const img = $(this)
        img.css("filter", "grayscale(0%)")
        const src = img.attr('src')
        if(regexAnimateAvatar.test(src)) {
            img.attr('src', src.replace(/png$/g, 'gif'))
        }
    })

    $('.mobile__guild').hover(function() {
        const img = $(`.mobile__guild #mobile__guild__${this.id}`);
        const src = img.attr('src');
        if(regexAnimateIcon.test(src)) {
            return img.attr('src', src.replace(/png$/g, 'gif'));
        }
    }, function() {
        const img = $(`.mobile__guild #mobile__guild__${this.id}`);
        const src = img.attr('src');
        if(regexAnimateIcon2.test(src)) {
             return img.attr('src', src.replace(/gif$/g, 'png'));
        };
    });
});

$(window).on('resize', function(){
    const win = $(this);
    if (win.width() >= 780) menu.removeClass("mobile__menu--active")
});