
var db = firebase.firestore();

const userreports = document.querySelector("#userreports");

db.collection("report").orderBy("caseid", "desc").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {

        userreports.innerHTML += "<div class='col'> <div class='card text-white bg-dark mb-3' style='min-width: 18rem; border-style: solid; border-color: #FC76A1; z-index: 1;'> <div class='card-header'><i class='fas fa-exclamation-triangle' style='color: #FC76A1;'></i> Case ID #" + doc.data().caseid + " <a href='#map' onClick='reply_click(this.id)' id='" + doc.data().caseid + "' style='background-color: #FC76A1; padding: 8px; font-size: 18px; border-radius: 1vw; float: right; margin: 0.5vw;'><i class='fas fa-crosshairs'></i></a></div> <div class='card-body'> <h5 class='card-title'><i class='fas fa-skull' style='color: #FC76A1;'></i> " + doc.data().crimeType + "</h5><hr> <p class='card-text'><i class='fas fa-calendar-alt' style='color: #FC76A1;'></i> " + String(doc.data().datetime.toDate()).substring(0, 24) + "<hr> <p class='card-text'><i class='fas fa-user' style='color: #FC76A1;'></i> " + doc.data().name + "<hr><i class='fas fa-phone' style='color: #FC76A1;'></i> +91 " + doc.data().phoneNo + "<hr><i class='fas fa-map-marker-alt' style='color: #FC76A1;'></i> " + doc.data().location.latitude.toFixed(4) + "° N , " + doc.data().location.longitude.toFixed(4) + "° E<hr><i class='fas fa-info-circle' style='color: #FC76A1;'></i> " + doc.data().description + "</p> <button onClick='deleteReport1(this.id)' class='btn hover-item' id='del"+doc.data().caseid+"'  style='float: right; color: white; background-color: #30303D; border-radius: 1vw; border-style: solid;'>Close case</button>  </div> </div>"
        var el = document.createElement('div');
        el.className = 'marker';
        var marker = new mapboxgl.Marker(el)
            .setLngLat([doc.data().location.longitude, doc.data().location.latitude])
            .setPopup(new mapboxgl.Popup().setHTML("<h5>Case ID #" + doc.data().caseid + "</h5><hr><h6 style='text-align: left'><i class='fas fa-skull-crossbones'></i> " + doc.data().crimeType + "</h6>" + "<h6 style='text-align: left'><i class='fas fa-phone-alt'></i> +91 " + doc.data().phoneNo + "</h6>" + "<h6 style='text-align: left'><i class='fas fa-map-pin'></i> " + doc.data().location.latitude.toFixed(4) + " | " + doc.data().location.longitude.toFixed(4) + "</h6>"))
            .addTo(map);

    });
});



function reply_click(clicked_id) {

    // console.log(clicked_id);
    db.collection("report").where("caseid", "==", clicked_id)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                 var lat = doc.data().location.latitude;
                 var lon = doc.data().location.longitude;

                // document.getElementById(clicked_id).addEventListener('click', function () {
                    map.flyTo({
                        center: [
                            lon, lat
                        ],
                        essential: true,
                        zoom: 15
                    });
                // });


            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
}



function SearchReport(){
    var searchreport = document.getElementById("searchreport").value;
    location.hash = searchreport;
    setTimeout(function () {
        location.hash = null;
    }, 3000);
}


function resetmodalfooter(){
    const solvedcasemodalfooter = document.querySelector("#solved-case-modal-footer");
    solvedcasemodalfooter.remove();
    // solvedcasemodalfooter.innerHTML += '<h1 style="color: white">hi</h1>';
    $('#solved-case-modal').modal('hide');
}

function deleteReport1(delbuttonid){
    
    const upperdivsolvedcasemodalfooter = document.querySelector("#upperdivsolvedcasemodalfooter");
    upperdivsolvedcasemodalfooter.innerHTML += '<div class="modal-footer" id="solved-case-modal-footer"><button id="' + '2'+delbuttonid + '" type="button" class="btn hover-item" onclick="deleteReport2(this.id)" style="color: white; background-color: #FC76A1; border-radius: 1vw;">Delete report</button></div>'
    
    $('#solved-case-modal').modal('show');
    // $('#offcanvasBottom2').offcanvas('hide');
    // console.log(delbuttonid);
    
}



function deleteReport2(delbuttonid2){

    // console.log(delbuttonid2);
    // const solvedcasemodalfooter = document.querySelector("#solved-case-modal-footer");
    // solvedcasemodalfooter.remove();
    // $('#solved-case-modal').modal('hide');
   
    var policeStatement = document.getElementById("policeStatement").value;
    var highsecuritypassword = document.getElementById("highsecuritypassword").value;
    
    if(highsecuritypassword == 'chapritapri'){
        console.log(delbuttonid2);
        
        delbuttonid2 = (delbuttonid2).substring(4, 16)
        console.log(delbuttonid2);
        db.collection("report").where("caseid", "==", delbuttonid2)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                
                console.log(doc.id, " => ", doc.data());
                const user = firebase.auth().currentUser;
                //add data to solved-report
                db.collection("solved-report").add({
                    caseid: doc.data().caseid,
                    crimeType: doc.data().crimeType,
                    reportDateTime: doc.data().datetime,
                    reportersDescription: doc.data().description,
                    reportersEmail: doc.data().email,
                    reportersEmerphoneNo: doc.data().emerPhoneNo,
                    reportersGender: doc.data().gender,
                    reportersHomeAddress: doc.data().homeaddress,
                    incidentLocation: doc.data().location,
                    reportersName: doc.data().name,
                    reportersPhoneNo: doc.data().phoneNo,
                    policeAssignedEmail: user.email,
                    policeAssignedName: user.displayName,
                    policeAssignedVerdict: policeStatement
                })
                .then((docRef) => {
                    console.log("Document written with ID: ", docRef.id);

                    db.collection("report").doc(doc.id).delete().then(() => {
                        console.log("Document successfully deleted!");
                    }).catch((error) => {
                        console.error("Error removing document: ", error);
                    });

                    const solvedcasemodalfooter = document.querySelector("#solved-case-modal-footer");
                    solvedcasemodalfooter.remove();
                    $('#solved-case-modal').modal('hide');
                    $('#solved-case-modal-success').modal('show');
                })
                .catch((error) => {
                    console.error("Error adding document: ", error);
                });


             
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });




    }else{
        console.log('out');
        const solvedcasemodalfooter = document.querySelector("#solved-case-modal-footer");
        solvedcasemodalfooter.remove();
        $('#solved-case-modal').modal('hide');
        var solvedcasemodalerror = document.querySelector("#solved-case-modal-error");
        solvedcasemodalerror.innerHTML += 'Entered password is incorrect';
        $('#solved-case-modal-failure').modal('show');
    }


}

function refreshpageafterdelete(){
    location.reload();
}




