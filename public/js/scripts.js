const templates = {
    home_games:`<div class="main">
                    <div id='matches' v-if = "nextMatches(this.date.getDate(), this.date.getMonth()+1).length != 0" >
                        <h2><b>Next Matches</b></h2>
                        <div class="event text-center" v-for= "match in nextMatches(date.getDate(), date.getMonth() +1)">
                           <p>{{match.team1}} vs {{match.team2}}</p>
                           <p>{{match.date}}/{{match.month}}</p>
                           <p>{{match.times}}</p>
                       </div>
                    </div>
                    <div v-else id= "noMatches">
                        <h2> <b>No Matches</b> <h2>
                        <section>
                            <div class="event text-center">
                                <span><b>NYSL Fundraiser</b><br> August 4</span>
                            </div>
                            <div class="event text-center">
                                <span><b>Kick-Off: Meet the Teams</b><br> August 16</span>
                            </div><div class="event text-center">
                                <span><b>First Game of the Season</b><br> September 1</span>
                            </div>
                        </section>
                    </div>
               </div>`,
    location:`<div class="main container">
                <h2><b>Locations</b></h2>
                
                <div class = "accordion mt-2" v-for = "location in locations">
                    <button class="btn-block" name="button" type="button" v-on:click="openAccordion(location.name)">
                            {{location.name}}
                        </button>
                        <p class="embed" :id="location.name">
                            <iframe :src="location.mapa">
                            </iframe>
                        </p>
                </div>
                     
               </div>`,
    schule:`<div class="main">
                <h2><b>Schule</b></h2>   
                <div class= "checkbox">    
                    <label v-for="team in teamsObject">
                           <input v-model="teams" type="checkbox" name="team" :value="team.name" checked> {{team.name}}
                    </label>
                </div>
                <div class = "select">
                    <label for="selectMonth">Select Month</label>
                    <select v-model="selectMonth" id="month" name="month">
                        <option selected value="all">All Months</option>
                        <option  v-for="month in mesesValidos" :value="month">
                                    {{month}}
                        </option>
                    </select>
                </div>
                <div class="table-game">
                    <table class="table table-sm">
                        <thead id="head-table">
                           <tr>
                               <th>Date</th>
                               <th>Teams</th>
                               <th>Info</th>
                           </tr>
                        </thead>
                        <tbody>
                           <tr v-for="value in mostrarGames()">
                               <td>{{value.date}}/{{value.month}}</td>
                           <td>{{value.team1}} vs {{value.team2}}</td>
                               <td>{{value.location}}<div id="map_landspace"><button @click="openMapLandspace(value.location)"><i class="far fa-map"></i></button></div><br>
                               {{value.times}}<div class="comentarios" v-if= " user !='guest'"><i class="fas fa-comment"></i></div>
                               </td>
                          </tr>
                        </tbody>
                    </table>
                    <div id="landspace">
                        <iframe id="mapa"></iframe>
                    </div>
                </div>
            </div>`,
    contact:`<div class="main">
                    <h2><b>Contact</b></h2>
                    <ul>
                        <li class="sb">
                            <i class="fa fa-map-marker-alt"></i>
                                123 Fake st
                        </li>
                        <li class="sb">
                            <i class="fa fa-phone"></i>
                                (555) 555-5555
                        </li>
                        <li class="sb">
                            <i class="fa fa-envelope"></i>
                                nysl@x.com
                        </li>
                    </ul>
                
                    <div class="contact">
                        <form>
                            <p>
                                <label>First Name (*)</label>
                                <input id="name" name="name" required="" type="text"></input>
                            </p>
                            <p>
                                <label>Last Name</label>
                                <input id="lastname" name="lastname" type="text"></input>
                            </p>
                            <p>
                                <label>Email Address(*)</label>
                                <input id="email" name="email" required="" type="email"></input>
                            </p>
                            <p>
                                <label>Phone Number</label>
                                <input id="phone" name="phone" type="number"></input>
                            </p>
                            <p class="full">
                                <label>Message</label>
                                <textarea id="message" name="message" rows="5"></textarea>
                            </p>
                            <p class="full">
                                <button class ="btn-block" type="submit">Submit</button>
                            </p>
                        </form>
                    </div>
                    
               </div>`
    
}
var aux = json_info;
var app = new Vue({
    el: '#app',
    data: {
        user:"guest",
        view: 'home_games',
        games: [],
        teams:[],
        locations:[],
        json_info: aux,
        gameInfo: [],
        teamsObject : [],
        mesesValidos:[],
        allMonths:["Junuary", "February", "March", "April","May","June", "July", "August", "September", "October", "November","December"],
        
    },
    created: function(){ 
        this.getInfo();
    },
    components: {
        home_games: {
            props: ["games"],
            data: function(){
                return {
                    date: new Date()
                }
            },
            methods: {
                nextMatches(dia, mes){
                    let sigPartido = [];
                    for(let i = 0;i < this.games.length; i++){
                        if(parseInt(this.games[i].month) == mes){
                            if(this.games[i].date >= dia && this.games[i].date <= (dia+10)){
                                sigPartido.push(this.games[i]);
                            }                            
                        }else if(dia +10 >31){
                            let sigMes = parseInt(this.games[i].month);
                            if(mes+1 == sigMes)
                                if(this.games[i].date <= (dia +10 - 31))
                                    sigPartido.push(this.games[i])
                        }
                    }                
                    return sigPartido;
                },
            },
            template : templates.home_games
        },
        schule: {
            props : ["games","teamsObject","teams","allMonths", "mesesValidos", "user","locations"],
            data: function(){
                return{
                   selectMonth: 'all'
                }
            },
            methods:{
                mostrarGames(){
                    let tabla = [];
                    for(let i = 0; i < app.games.length; i++){
                        if(app.teams.includes(app.games[i].team1 || app.games[i].team2)){
                            if(this.selectMonth == 'all')
                                tabla.push(app.games[i])
                            else {
                                let auxMonth = app.allMonths.indexOf(this.selectMonth)+1;
                                if(auxMonth == app.games[i].month)
                                    tabla.push(app.games[i])
                            }
                        }
                    }
                    return tabla;
                },
                openMapLandspace(location){
                    let name = location.replace(/ /g,"");
                    let mapa = app.locations[name].mapa; 
                    document.getElementById("mapa").src = mapa;
                    document.getElementById("landspace").style.display ="block"
                }
            }/*,
            computed: {
                asignarEquipos: {
                return this.teams.trim();
              }
            }*/,
            template: templates.schule
        },
        location: {
            props : ["locations"],
            methods:{
                openAccordion(id){
                    document.getElementById(id).classList.toggle('is-open');
                }
            },
            template : templates.location
        },
        contact :{
            props: [],
            template : templates.contact
        }

    },
    methods:{
        getInfo(){
            /*fetch("./js/scripts.js",{method: "GET"})
                .then(function(rta){
                    return rta.json();
            }).then(function(json){*/
                //app.json_info = json;
                this.gameInfo = this.json_info.games;
                this.teamsObject = this.json_info.teams;
                this.locations = this.json_info.locations;
                this.cargarBase('teams');
                this.cargarBase('games');
                this.cargarBase('month')
            /*}).catch(function(error){
                console.log(error);
            }) */      
        },
        cargarBase(algo){
            switch(algo){
                case 'teams': {
                    let a = Object.values(this.teamsObject);
                    this.teams = [];
                    for(let i = 0; i< a.length; i++){
                        this.teams.push(a[i].name);
                    }
                    break;
                }
                case 'games' :{
                    var a = Object.values(this.gameInfo);
                    this.games = [];
                    for(let i =0; i<a.length; i++){
                      this.games.push(a[i]);
                    }
                    break;
                }
                case 'month' :{
                    this.mesesValidos=[];
                    for (let i=0; i<this.games.length; i++){
                        let month = this.allMonths[parseInt(this.games[i].month)-1];
                        if(!this.mesesValidos.includes(month))
                            this.mesesValidos.push(month);
                    }
                }
                    
            }
        },
        openNav() {
            if(app.user == 'guest')
                document.getElementById("noLogged").style.width = "100%";
            else
                document.getElementById("logged").style.width = "100%";
        },
        closeNav() {
            if(app.user == 'guest')
                document.getElementById("noLogged").style.width = "0";
            else
                document.getElementById("logged").style.width = "0";
        },
        login(){
                    let provider = new firebase.auth.GoogleAuthProvider();
                    firebase.auth().signInWithPopup(provider)
                    .then(function(result){
                            document.getElementById("noLogged").style.width = "0";
                            app.user = result.user
                    })
                    .catch(function(error){
                        console.log(error)
                    })
        },
        logout() {
                    firebase.auth().signOut()
                        .then(function () {
                        document.getElementById("logged").style.width = "0";
                            app.user = "guest"
                        })
                }
    }/*,
    computed:{
        creandoDesplegable(){
            let mesValidos=[];
                    for (let i=0; i<this.games.length; i++){
                        let month = this.allMonths[parseInt(this.games[i].month)-1];
                        if(!mesValidos.includes(month))
                            mesValidos.push(month);
            }
            return mesValidos;
        }
    }*/
})