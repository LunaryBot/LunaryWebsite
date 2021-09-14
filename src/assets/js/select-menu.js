$(".select").hover(function() {
    const menuID = this.id
    const menu = $(this)
    menu.addClass("open")

    menu.find(".custom-options").find("span").each(function() {
        const option = $(this)

        option.click(function() {
            const o = $(this)
            menu.find(".custom-options span.selected").map(function() {
                const op = $(this)
                op.removeClass("selected")
            })
            if(!o.hasClass("selected")) {
                o.addClass("selected")
                menu.find("div.select__trigger p").text(o.attr("name") || o.text())

                const cardsave = $("#card-save")
                if(cardsave) cardsave.addClass("ok")
            }
        })
    })
    menu.find("input").keyup(function() {
        const value = ($(this).val() || "").toLowerCase()
        menu.find("span").each(function(i, x) {
            const option = $(this)
            if(option.text().toLowerCase().indexOf(value) > -1 || option.attr('data-value').toLowerCase() == value) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    })
}, function() {
    const menu = $(this)
    menu.find("input").val("")
    menu.removeClass("open")
    menu.find("span").each(function(i, x) {
        const option = $(this).show()
    })
})