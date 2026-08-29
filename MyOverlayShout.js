let displayTime = 8;
let enableHearts = true;

let hideTimer = null;
let heartsInterval = null;


// =======================================
// WIDGET CARREGADO
// =======================================

window.addEventListener(
    'onWidgetLoad',
    function (obj) {

        const data = obj.detail.fieldData || {};

        displayTime =
            Number(data.displayTime || 8);

        enableHearts =
            data.enableHearts !== false;
    }
);


// =======================================
// EVENTOS DO STREAMELEMENTS
// =======================================

window.addEventListener(
    'onEventReceived',
    function (obj) {

        const listener =
            obj.detail.listener;

        const event =
            obj.detail.event;

        if (listener !== 'message') {
            return;
        }

        if (
            !event ||
            !event.data ||
            !event.data.text
        ) {
            return;
        }

        handleMessage(
            event.data.text
        );
    }
);


// =======================================
// IDENTIFICAR !S2
// =======================================

function handleMessage(text) {

    const cleanText =
        text.trim();

    const parts =
        cleanText.split(/\s+/);

    if (parts.length < 2) {
        return;
    }

    const command =
        parts[0].toLowerCase();

    if (command !== '!s2') {
        return;
    }

    let username =
        parts[1];

    username =
        username
            .replace('@', '')
            .trim();

    if (!username) {
        return;
    }

    showS2(username);
}


// =======================================
// BUSCAR INFORMAÇÕES
// =======================================

async function showS2(username) {

    const root =
        document.getElementById('s2-root');

    const usernameElement =
        document.getElementById('s2-username');

    const avatarElement =
        document.getElementById('s2-avatar');

    const gameElement =
        document.getElementById('s2-game');


    // Mostra inicialmente o username

    usernameElement.textContent =
        '@' + username;

    gameElement.textContent =
        'Buscando jogo...';


// ===================================
// AVATAR
// ===================================

try {

    const avatarResponse = await fetch(
        'https://decapi.me/twitch/avatar/' +
        encodeURIComponent(username)
    );

    const avatarURL =
        (await avatarResponse.text()).trim();

    console.log(
        'Avatar encontrado:',
        avatarURL
    );

    if (
        avatarResponse.ok &&
        avatarURL.startsWith('http')
    ) {

        avatarElement.src =
            avatarURL;

    } else {

        console.error(
            'Avatar inválido:',
            avatarURL
        );

        avatarElement.src =
            'https://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_300x300.png';
    }

} catch (error) {

    console.error(
        'Erro ao buscar avatar:',
        error
    );

    avatarElement.src =
        'https://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_300x300.png';
}


    // ===================================
    // JOGO
    // ===================================

    try {

        const response =
            await fetch(
                'https://decapi.me/twitch/game/' +
                encodeURIComponent(username)
            );

        const game =
            await response.text();


        if (
            response.ok &&
            game &&
            !game.toLowerCase().includes('not found')
        ) {

            gameElement.textContent =
                game.trim();

        } else {

            gameElement.textContent =
                'Offline';

        }

    } catch (error) {

        console.error(
            'Erro ao buscar jogo:',
            error
        );

        gameElement.textContent =
            'Offline';
    }


    // ===================================
    // MOSTRAR OVERLAY
    // ===================================

    root.classList.remove(
        'hidden',
        'hide'
    );

    root.classList.add('show');


    // ===================================
    // CORAÇÕES
    // ===================================

    if (enableHearts) {

        startHearts();

    }


    // cancela timer anterior

    if (hideTimer) {

        clearTimeout(hideTimer);

    }


    // programa saída

    hideTimer =
        setTimeout(
            hideS2,
            displayTime * 1000
        );
}


// =======================================
// ESCONDER
// =======================================

function hideS2() {

    const root =
        document.getElementById('s2-root');


    root.classList.remove('show');

    root.classList.add('hide');


    stopHearts();


    setTimeout(
        function () {

            root.classList.remove('hide');

            root.classList.add('hidden');

        },
        650
    );
}


// =======================================
// CORAÇÕES
// =======================================

function startHearts() {

    stopHearts();

    createHeart();

    heartsInterval =
        setInterval(
            createHeart,
            450
        );
}


function stopHearts() {

    if (heartsInterval) {

        clearInterval(
            heartsInterval
        );

        heartsInterval = null;
    }
}


function createHeart() {

    const container =
        document.getElementById(
            's2-hearts'
        );


    const heart =
        document.createElement('div');


    heart.className =
        's2-heart';


    const hearts = [
        '🕹️',
        '🎮',
        '😎',
        '✨'
    ];


    heart.textContent =
        hearts[
            Math.floor(
                Math.random() *
                hearts.length
            )
        ];


    heart.style.left =
        (
            60 +
            Math.random() * 430
        ) + 'px';


    heart.style.animationDuration =
        (
            2.5 +
            Math.random() * 2
        ) + 's';


    heart.style.fontSize =
        (
            14 +
            Math.random() * 15
        ) + 'px';


    container.appendChild(
        heart
    );


    setTimeout(
        function () {

            heart.remove();

        },
        5000
    );
}