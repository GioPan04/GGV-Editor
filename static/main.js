var observe;
if (window.attachEvent) {
    observe = function (element, event, handler) {
        element.attachEvent('on'+event, handler);
    };
}
else {
    observe = function (element, event, handler) {
        element.addEventListener(event, handler, false);
    };
}
$(document).ready(function () {
    var text = document.getElementById('text');
    function resize () {
        text.style.height = 'auto';
        text.style.height = text.scrollHeight+'px';
    }
    /* 0-timeout to get the already changed text */
    function delayedResize () {
        window.setTimeout(resize, 0);
    }
    observe(text, 'change',  resize);
    observe(text, 'cut',     delayedResize);
    observe(text, 'paste',   delayedResize);
    observe(text, 'drop',    delayedResize);
    observe(text, 'keydown', delayedResize);

    text.focus();
    text.select();
    resize();
    $('#articleTitle').focus();
    $('#articleTitle').html("");
    $("#articleTitle").blur(function () {
        var title = $('#articleTitle').html();
        if (title != "" && title != " " && title != "<br>") {
            document.title = `${title} - GGV Editor`;
        }
    });
    $("#add_title").click(function () {
        insertAtCaret("text", '# ');
        resize();
    });
    $("#add_subtitle").click(function () {
        insertAtCaret("text", '## ');
        resize();
    });
    $("#add_link").click(function () {
        var link = prompt("Scrivi il link", "https://example.com");
        var linktext = prompt("Scrivi il testo del link", "Google");
        insertAtCaret("text", `[${linktext}](${link})`);
        resize();
    });
    $("#add_image").click(function () {
        var image = prompt("Scrivi il link dell'immagine", "https://example.com/image.png");
        insertAtCaret("text", `![image](${image})`);
        resize();
    });
    $("#add_image_link").click(function () {
        var image = prompt("Scrivi il link dell'immagine", "https://example.com/image.png");
        var imagelink = prompt("Scrivi il link a cui deve rimandare l'immagine", "https://example.com");
        insertAtCaret("text", `[![image](${image})](${imagelink})`);
        resize();
    });
    $("#add_page").click(function () {
        insertAtCaret("text", '\n-- NUOVA PAGINA (NON ELIMINARE QUESTA RIGA) --\n#');
        resize();
    });
    function insertAtCaret(areaId, text) {
        var txtarea = document.getElementById(areaId);
        if (!txtarea) {
            return;
        }

        var scrollPos = txtarea.scrollTop;
        var strPos = 0;
        var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ?
            "ff" : (document.selection ? "ie" : false));
        if (br == "ie") {
            txtarea.focus();
            var range = document.selection.createRange();
            range.moveStart('character', -txtarea.value.length);
            strPos = range.text.length;
        } else if (br == "ff") {
            strPos = txtarea.selectionStart;
        }

        var front = (txtarea.value).substring(0, strPos);
        var back = (txtarea.value).substring(strPos, txtarea.value.length);
        txtarea.value = front + text + back;
        strPos = strPos + text.length;
        if (br == "ie") {
            txtarea.focus();
            var ieRange = document.selection.createRange();
            ieRange.moveStart('character', -txtarea.value.length);
            ieRange.moveStart('character', strPos);
            ieRange.moveEnd('character', 0);
            ieRange.select();
        } else if (br == "ff") {
            txtarea.selectionStart = strPos;
            txtarea.selectionEnd = strPos;
            txtarea.focus();
        }

        txtarea.scrollTop = scrollPos;
    }
    $("#send").click(function () {
        var texts = $('#text').val().split('-- NUOVA PAGINA (NON ELIMINARE QUESTA RIGA) --\n');
        var test = "";
        texts.forEach(function (item, i) {
            test += `Pagina: ${i}\n${item}`;
        });
        alert(
            test
        );
    });
});