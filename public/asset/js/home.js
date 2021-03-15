const listPlayer = document.getElementById('player');

listPlayer.addEventListener('keyup', e => {
    e.preventDefault();
    let dataSearch = listPlayer.value;
    document.getElementById('list-player').style.display = 'block';
    if (dataSearch.length >= 3) {
        setTimeout(() => {
            const urlPlayer = 'https://www.balldontlie.io/api/v1/players?search=' + dataSearch;
            fetch(urlPlayer)
                .then(response => response.json())
                .then(response => {
                    JSON.stringify(response)
                    clearDiv('list-player')

                    response.data.map(item => {
                        var listP = document.createElement('li')
                        listP.className = 'search-player'
                        listP.setAttribute('id', 'player-' + item.id);
                        listP.setAttribute('onClick', 'searchPlayer(' + item.id + ')');
                        listP.textContent = item.first_name + ' ' + item.last_name
                        document.getElementById('list-player').appendChild(listP);
                    })

                })
                .catch(() => {
                    clearDiv('list-player')
                    var listP = document.createElement('li')
                    listP.className = 'search-player'
                    listP.textContent = 'Aucun résultat'
                    document.getElementById('list-player').appendChild(listP);
                });
        }, 200)
    } else {
        clearDiv('list-player')
    }
})

function searchPlayer(id) {
    const urlPlayer = 'https://www.balldontlie.io/api/v1/players/' + id;
    fetch(urlPlayer)
        .then(response => response.json())
        .then(response => {
            JSON.stringify(response)
            if (document.getElementById('title-name') === null) {
                addTitleH2('title-name', 'Noms des joueurs', 'place-title')
            }
            // Cacher l'ul
            document.getElementById('list-player').style.display = 'none';

            var element = document.createElement('div');
            element.setAttribute('id', 'clear-name-'+response.id)
            element.innerHTML =
                '<a href="/player/' + response.id + '" title="' + response.first_name + '">' + response.first_name + ' ' + response.last_name + '</a>'
            document.getElementsByClassName('place-player')[0].appendChild(element);
        })
        .catch(error => alert("Erreur 1 : " + error));

    // Url information stats
    const url = 'https://www.balldontlie.io/api/v1/stats?per_page=100&seasons[]=2019&seasons[]=2018&player_ids[]=' + id;
    fetch(url)
        .then(response => response.json())
        .then(response => {
            JSON.stringify(response);

            // Match played title
            if (document.getElementById('title-game') === null) {
                addTitleH2('title-game', 'Matchs joué', 'place-title')
            }
            // Match played content
            addState(response.data.length, 'place-match', 'reb-'+id)

            // Pts title
            if (document.getElementById('title-pts') === null) {
                addTitleH2('title-pts', 'Points', 'place-title')
            }
            let dataPts = 0;
            response.data.map(item => {
                dataPts = item.pts + dataPts
                return dataPts;
            });
            // Match played content
            addState(dataPts, 'place-pts', 'pts-'+id)
        })
        .catch(error => alert("Erreur 2 : " + error));

    // Adding search data to mysql
    var headers = {
        "Content-Type": "application/json",
        "Access-Control-Origin": "*"
    }
    var data = {
        "idApi": parseInt(id),
        "createdAt": new Date()
    }
    fetch("http://localhost:8000/api/searches", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data)
    })
        .then(function (response) {
            console.log('ok')
            return response.json();
        })
        .then(function (data) {
            console.log('ok 2')
            fetch('https://www.balldontlie.io/api/v1/players/' + data.idApi)
                .then(response => response.json())
                .then(response => {
                    // Search
                    addClass('current', response.id, response.last_name.toUpperCase() + ' ' + response.first_name, 'search-only');
                })
                .catch(error => {
                    console.log(error)
                })
        });


}
function clearSearch(id){
    let btnSearch = document.getElementById('clear-'+id);
    let btnName = document.getElementById('clear-name-'+id);
    let btnPts = document.getElementById('clear-pts-'+id);
    let btnReb = document.getElementById('clear-reb-'+id);
    btnSearch.style.display = 'none'
    btnName.style.display = 'none'
    btnPts.style.display = 'none'
    btnReb.style.display = 'none'
}
function addClass(className, id, title, destination) {
    var element = document.createElement('div')
    element.className = className;
    element.setAttribute('id', 'clear-'+id);
    element.innerHTML =
        '<h3 id="player-' + id + '">' + title + '</h3>' +
        '<button onclick="clearSearch('+id+')"><i class="far fa-times-circle"></i>\</button>'

    document.getElementsByClassName(destination)[0].appendChild(element);
}

function addTitleH2(className, title, destination) {
    var elementPtsTitle = document.createElement('div')
    elementPtsTitle.innerHTML = '<h2 id="' + className + '">' + title + '</h2>'
    document.getElementsByClassName(destination)[0].appendChild(elementPtsTitle);
}

function addState(content, destination, clear) {
    var elementPts = document.createElement('p');
    elementPts.setAttribute('id', 'clear-'+clear)
    elementPts.textContent = content
    document.getElementsByClassName(destination)[0].appendChild(elementPts);
}

function clearDiv(elementId) {
    let element = document.getElementById(elementId);
    element.innerHTML = "";
}