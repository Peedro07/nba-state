
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
                    console.log(document.getElementById('list-player'));
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
        }, 50)
    } else{
        clearDiv('list-player')
    }
})

function searchPlayer(id) {
    // Call api info player
    const urlPlayer = 'https://www.balldontlie.io/api/v1/players/' + id;
    fetch(urlPlayer)
        .then(response => response.json())
        .then(response => {

            // Call api info team
            fetch('https://www.balldontlie.io/api/v1/teams/'+response.team.id)
                .then(response => response.json())
                .then(response => {
                    addTitleH2('Équipe','stat-title');
                    addTitleH2('Conférence','stat-title');
                    addState(response.name,'stat-content');
                    addState(response.conference,'stat-content');

                })
                .catch(error => console.log(error))

            JSON.stringify(response)
            // Cacher la barre de recherche
            document.getElementById('list-player').style.display = 'none';
            document.getElementById('player').style.display = 'none';
            addTitleH1(response.first_name + ' ' +response.last_name, 'name-player')
        })
        .catch(error => alert("Erreur 1 : " + error));

    // // Call api info stats
    const url = 'https://www.balldontlie.io/api/v1/stats?per_page=100&seasons[]=2019&seasons[]=2018&player_ids[]=' + id;
    fetch(url)
        .then(response => response.json())
        .then(response => {
            JSON.stringify(response);

            console.log(response.data)
            let dataPts = 0;
            response.data.map(item => {
                dataPts = item.pts + dataPts
                return dataPts;
            });
            addTitleH2('Points','stat-title');
            addState(dataPts,'stat-content');
            let dataRbd = 0;
            response.data.map(item => {
                dataRbd = item.reb + dataRbd
                return dataRbd;
            });
            addTitleH2('Rebonds','stat-title');
            addState(dataRbd,'stat-content');

        })
        .catch(error => alert("Erreur 2 : " + error));
}

function addClass(className, title, destination) {
    var element = document.createElement('div')
    element.className = className;
    element.innerHTML = '<h3 id="' + className + '">' + title + '</h3>'
    document.getElementsByClassName(destination)[0].appendChild(element);
}

function addTitleH1(title, destination) {
    var elementPtsTitle = document.createElement('h1')
    elementPtsTitle.textContent = title
    document.getElementsByClassName(destination)[0].appendChild(elementPtsTitle);
}
function addTitleH2(title, destination) {
    var elementPtsTitle = document.createElement('h2')
    elementPtsTitle.textContent = title
    document.getElementsByClassName(destination)[0].appendChild(elementPtsTitle);
}
function addState(content, destination) {
    var elementPtsTitle = document.createElement('p')
    elementPtsTitle.textContent = content
    document.getElementsByClassName(destination)[0].appendChild(elementPtsTitle);
}

function clearDiv(elementId) {
    let element = document.getElementById(elementId);
    element.innerHTML = "";
}