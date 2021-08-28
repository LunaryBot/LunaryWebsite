for (const option of document.querySelectorAll(".custom-option")) {
    option.addEventListener('click', function() {
        if (!this.classList.contains('selected')) {
            this.parentNode.querySelector('.custom-option.selected').classList.remove('selected');
            this.classList.add('selected');
            this.closest('.select').querySelector('.select__trigger p').textContent = this.textContent;
        }
    })
}

$(".select").hover(function() {
    const menuID = this.id
    const menu = $(this)
    menu.addClass("open")

    menu.find(".custom-options").find("span").each(function() {
        const option = $(this)

        option.click(function() {
            const o = $(this)
            
            o.addClass("selected")
            menu.find(".select__trigger p").text(o.attr("name") || o.text())
        })
    })
    menu.find(".select-menu-search input").keyup(function() {
        const value = $(this).val()
        menu.find("span").each(function(i, x) {
            const option = $(this)
            if(option.text().indexOf(value) > -1 || option.attr('data-value') == value) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    })
}, function() {
    const menu = $(this)
    menu.find(".select-menu-search input").val("")
    menu.removeClass("open")
    menu.find("span").each(function(i, x) {
        const option = $(this).show()
    })
})