window.addEventListener("load", function() {
    // Verificando se o navegador é compativel

    if(/(?:\b(MS)?IE\s+|\bTrident\/7\.0;.*\s+rv:|\bEdge\/)(\d+)/.test(navigator.userAgent)) {
        alert("Você está usando um navegador não suportado, as funcionalidades da dashboard podem não funcionar como ddevido. Recomendamos que você utilize alguns dos navegadores a seguir:\n\nMozilla Firefox: https://www.mozilla.org/firefox\nGoogle Chrome: https://www.google.com/chrome\nNovo Microsoft Edge: https://www.microsoft.com/edge")
    }
})