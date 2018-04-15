/**
 * Created by asriva26 on 7/4/2017.
 */

// -------------------------------------------------
// PET (color version)
// Physiologically Equivalent Temperature PET
// (calculated on the basis of MEMI)
// Program version: 1.5.1996 P. Hoeppe
// -------------------------------------------------


//    Program PETBER

var acl = 0;
var adu;
var aeff;
var age;
var c = new Array(10);//(0:10);
var cair;
var cb;
var cbare;
var cclo;
var csum;
var di;
var ed;
var emcl;
var emsk;
var enbal;
var enbal2;
var ere;
var erel;
var eres;
var esw;
var eswdif;
var eswphy;
var eswpot;
var eta;
var evap;
var facl;
var fcl;
var fec;
var feff;
var food;
var h;
var hc;
var he;
var ht;
var htcl;
var icl;
var mbody;
var met;
var metbf;
var metbm;
var metf;
var metm;
var p;
var po;
var r1;
var r2;
var rbare;
var rcl;
var rclo;
var rclo2;
var rdcl;
var rdsk;
var rob;
var rsum;
var rtv;
var sigm;
var sw;
var swf;
var swm;
var ta;
var tbody;
var tcl;
var tcore = new Array(7); //(1: 7);
var tex;
var tmrt;
var tsk;
var tx;
var v;
var vb;
var vb1;
var vb2;
var vpa;
var vpex;
var vpts;
var wetsk;
var wd;
var work;
var wr;
var ws;
var wsum;
var xx;

var contr;
var count1;
var count2;
var pos;
var sex;
var esc;
esc = String.fromCharCode(27);
//Open (6, file = 'out.tab');

// PERSONAL INFORMATION

age = 35.0;
mbody = 75.0;
ht = 1.75;
work = 80.0;
eta = 0.0;
icl = 0.9;
fcl = 1.15;
pos = 1;
sex = 1;

// CONSTANTS

po = 1013.25;
p = 1013.25;
rob = 1.06;
cb = 3.64 * 1000.0;
food = 0.0;
emsk = 0.99;
emcl = 0.95;
evap = 2.42 * Math.pow(10,6); // 10. ** 6.
sigm = 5.67 * Math.pow(10,-8); // 10. ** (- 8)


// INTERACTIVE DATA INPUT
ta = 35;
tmrt = 29;
vpa = 50;
v = 2.5;

//var PET = CalcPET(ta, tmrt, vpa, v);

module.exports = function CalcPET(ta, tmrt, vpa, v){

    var output = {};

    console.log("The Air Temperature in C is: " + ta);
    console.log("The Mean Radiant Temperature in C is: " + tmrt);
    console.log("The Steam Pressure in hPa is: " + vpa);
    console.log("The Wind Speed in m/s is: " + v);


    // SUBROUTINE INKOERP

    metbf = 3.19 * Math.pow(mbody,0.75) * (1. + 0.004 *(30. -age) + 0.018 *((ht*100./(Math.pow(mbody,(1.0/3.0)))) - 42.1));
    metbm = 3.45 * Math.pow(mbody,0.75) * (1. + 0.004 *(30. -age) + 0.010 *((ht*100./(Math.pow(mbody,(1.0/3.0)))) - 43.4));
    metm = work + metbm;
    metf = work + metbf;

    if(sex === 1)	met = metm;
    if(sex === 2)	met = metf;
    h = met * (1.0 - eta);

    //       SENSIBLE RESPIRATIONS ENERGIE

    cair	= 1.01 * 1000.;
    tex   = 0.47 * ta + 21.0;
    rtv   = 1.44 * Math.pow(10,-6) * met;
    eres = cair * (ta - tex) * rtv;

    //       LATENTE RESPIRATIONSENERGIE

    vpex  = 6.11 * Math.pow(10, (7.45 * tex / (235. +tex)));
    erel= 0.623 * evap / p * (vpa - vpex) * rtv;

    //       SUMME DER ERGEBNISSE

    ere = eres + erel;

    // SUBROUTINE BERECH
    var count3;
    var j;

    wetsk   = 0.0;
    adu    = 0.203 * Math.pow(mbody,0.425) * Math.pow(ht,0.725);

    hc = 2.67 + ( 6.5 * Math.pow(v,0.67));
    hc   = hc * Math.pow((p /po),0.55);
    feff = 0.725;
    //rcl = icl / 6.45;
    facl = (- 2.36 + 173.51 * icl - 100.76 * icl * icl + 19.28 * (Math.pow(icl,3.0))) / 100.0;

    if (facl > 1.0)   facl = 1.0;
    rcl = (icl/6.45)/facl;
    var y;
    if (icl>2.0)	  y  = 1.0;

    if ((icl > 0.6) && (icl < 2.0))  y = (ht - 0.2) / ht;
    if ((icl <= 0.6) && (icl < 0.3)) y = 0.5;
    if ((icl <= 0.3) && (icl > 0.))  y = 0.1;

    r2   = adu * (fcl - 1. + facl) / (2. * 3.14 * ht * y);
    r1   = facl * adu / (2. * 3.14 * ht * y);

    di   = r2 - r1;
    //       HAUTTEMPERATUREN

    j = 0;
    label_90();
    function label_90(){
        //console.log("label_90");
        j++;
        tsk	= 34.0;
        count1 = 0;
        tcl = (ta + tmrt + tsk) / 3.0;
        count3 = 1;
        enbal2 = 0.0;

        label_20();
        function label_20() {

            acl = adu * facl + adu * (fcl - 1.0);
            rclo2 = emcl * sigm * (Math.pow((tcl + 273.2), 4.0) - Math.pow((tmrt + 273.2), 4.0)) * feff;
            htcl = 6.28 * ht * y * di / (rcl * Math.log(r2 / r1) * acl);
            tsk = 1. / htcl * (hc * (tcl - ta) + rclo2) + tcl;

            //      STRAHLUNGSSALDO

            aeff = adu * feff;
            rbare = aeff * (1. - facl) * emsk * sigm * (Math.pow((tmrt + 273.2), 4.0) - Math.pow((tsk + 273.2), 4.0));
            rclo = feff * acl * emcl * sigm * (Math.pow((tmrt + 273.2), 4.0) - Math.pow((tcl + 273.2), 4.0));
            rsum = rbare + rclo;

            //       KONVEKTION

            cbare = hc * (ta - tsk) * adu * (1. - facl);
            cclo = hc * (ta - tcl ) * acl;
            csum = cbare + cclo;

            //       KERNTEMPERATUR

            c[0] = h + ere;
            c[1] = adu * rob * cb;
            c[2] = 18. - 0.5 * tsk;
            c[3] = 5.28 * adu * c[2];
            c[4] = 0.0208 * c[1];
            c[5] = 0.76075 * c[1];
            c[6] = c[3] - c[5] - tsk * c[4];
            c[7] = -c[0] * c[2] - tsk * c[3] + tsk * c[5];
            c[8] = c[6] * c[6] - 4.0 * c[4] * c[7];
            c[9] = 5.28 * adu - c[5] - c[4] * tsk;
            c[10] = c[9] * c[9] - 4.0 * c[4] * (c[5] * tsk - c[0] - 5.28 * adu * tsk);

            if (tsk === 36.0) tsk = 36.01;
            tcore[7] = c[0] / (5.28 * adu + c[1] * 6.3 / 3600.) + tsk;
            tcore[3] = c[0] / (5.28 * adu + (c[1] * 6.3 / 3600.) / (1 + 0.5 * (34. - tsk))) + tsk;


            switch (true) {
                case(c[10] < 0.0):
                    label_22();
                    break;
                default:
                    tcore[6] = (-c[9] - Math.pow(c[10], 0.5)) / (2. * c[4]);
                    tcore[1] = (-c[9] + Math.pow(c[10], 0.5)) / (2. * c[4]);
                    label_22();
                    break;
            }

            function label_22() {
                switch (true) {
                    case(c[8] < 0.0):
                        label_24();
                        break;
                    default:
                        tcore[2] = (-c[6] + Math.pow(Math.abs(c[8]), 0.5)) / (2. * c[4]);
                        tcore[5] = (-c[6] - Math.pow(Math.abs(c[8]), 0.5)) / (2. * c[4]);
                        label_24();
                        break;
                }
            }

            function label_24() {
                tcore[4] = c[0] / (5.28 * adu + c[1] * 1.0 / 40.0) + tsk;
            }

            //      TRANSPIRATION
            tbody = 0.1 * tsk + 0.9 * tcore [j];
            swm = 304.94 * (tbody - 36.6) * adu / 3600000.0;
            vpts = 6.11 * Math.pow(10., (7.45 * tsk / (235. + tsk)));

            if (tbody <= 36.6) swm = 0.0;
            swf = 0.7 * swm;

            if (sex === 1) sw = swm;
            if (sex === 2) sw = swf;
            eswphy = -sw * evap;
            he = 0.633 * hc / (p * cair);
            fec = 1. / (1. + 0.92 * hc * rcl);
            eswpot = he * (vpa - vpts) * adu * evap * fec;
            wetsk = eswphy / eswpot;
            if (wetsk > 1.0) wetsk = 1.0;

            eswdif = eswphy - eswpot;

            if (eswdif <= 0.0) esw = eswpot;
            if (eswdif > 0.0) esw = eswphy;
            if (esw > 0.0) esw = 0.0;

            //       DIFFUSION

            rdsk = 0.79 * Math.pow(10.0, 7.0);
            rdcl = 0.0;
            ed = evap / (rdsk + rdcl) * adu * (1 - wetsk) * (vpa - vpts);

            //       MAX VB

            vb1 = 34. - tsk;
            vb2 = tcore[j] - 36.6;

            if (vb2 < 0.0) vb2 = 0.0;
            if (vb1 < 0.0) vb1 = 0.0;
            vb = (6.3 + 75. * (vb2)) / (1. + 0.5 * vb1);

            //       ENERGIEBILANZ

            enbal = h + ed + ere + esw + csum + rsum + food;

            //       KLEIDUNGSTEMPERATUR

            if (count1 === 0) xx = 1.0;
            if (count1 === 1) xx = 0.1;
            if (count1 === 2) xx = 0.01;
            if (count1 === 3) xx = 0.001;

            if (enbal > 0.0) tcl = tcl + xx;
            if (enbal < 0.0) tcl = tcl - xx;
            switch (true) {
                case((enbal <= 0.0) && (enbal2 > 0.0)):
                    label_30();
                    break;
                case((enbal >= 0.0) && (enbal2 < 0.0)):
                    label_30();
                    break;
                default:
                    enbal2 = enbal;
                    count3 = count3 + 1;
                    switch (true) {
                        case(count3 > 200):
                            label_30();
                            break;
                        default:
                            label_20();
                            break;
                    }
                    break;
            }

        }
        function label_30(){
            switch (true){
                case((count1 === 0.0)||(count1===1.0)||(count1===2.0)):
                    count1 = count1 + 1.0;
                    enbal2 = 0.0;
                    label_20();
                    break;
                case((count1 === 0.0)||(count1===1.0)||(count1===2.0)):
                    count1 = count1 + 1.0;
                    enbal2 = 0.0;
                    label_20();
                    break;
                case(count1 === 3.0):
                        switch(true){
                            case((j === 2) || (j === 5)):
                                label_40();
                                break;
                            case((j === 6) || (j === 1)):
                                label_50();
                                break;
                            case(j === 3):
                                label_60();
                                break;
                            case(j === 7):
                                label_70();
                                break;
                            case(j === 4):
                                label_80();
                                break;
                            default:
                                break;
                        }
                    break;
                default:
                    label_40();
                    break;
            }
        }
    }
    function label_40(){
        switch (true){
            case(c[8] < 0.0):
                label_90();
                break;
            case((tcore[j] >= 36.6) && (tsk <= 34.050)):
                label_80();
                break;
            default:
                label_90();
                break;
        }
    }
    function label_50(){
        switch (true){
            case(c[10] < 0.0):
                label_90();
                break;
            case((tcore[j] >= 36.6) && (tsk > 33.850)):
                label_80();
                break;
            default:
                label_90();
                break;
        }
    }
    function label_60(){
        switch (true){
            case((tcore[j] < 36.6) && (tsk <= 34.000)):
                label_80();
                break;
            default:
                label_90();
                break;
        }
    }
    function label_70(){
        switch (true){
            case((tcore[j] < 36.6) && (tsk > 34.000)):
                label_80();
                break;
            default:
                label_90();
                break;
        }
    }
    function label_80() {
        switch (true) {
            case((j !== 4) && (vb >= 91.0)):
                label_90();
                break;
            case((j === 4) && (vb < 89.0)):
                label_90();
                break;
            case(vb > 90.0):
                vb = 90.0;
                break;
            default:
                break;
        }
    }

    //       WASSERVERLUSTE

    ws = sw * 3600.0 * 1000.0;
    if (ws > 2000.0) ws = 2000.0;
    wd = ed / evap * 3600. * (-1000.);
    wr = erel / evap * 3600. * (-1000.);

    wsum = ws + wr + wd;

    return subroutine_PET();

    // SUBROUTINE PET

    function subroutine_PET(){
        tx = ta;
        enbal2 = 0.0;
        count1 = 0;
        var rsum_temp = rsum;
        var csum_temp = csum;
        var ere_temp = ere;
        return label_150();
        function label_150(){
            hc = 2.67 + 6.5 * Math.pow(0.1, 0.67);
            hc = hc * Math.pow((p /po), 0.55);

            //       STRAHLUNGSSALDO

            aeff  = adu * feff;
            rbare  = aeff * (1.- facl ) * emsk * sigm *	(Math.pow((tx + 273.2), 4.0) - Math.pow((tsk + 273.2), 4.0));
            rclo = feff * acl * emcl * sigm * (Math.pow((tx + 273.2), 4.0) - Math.pow((tcl + 273.2), 4.0));
            rsum_temp	= rbare + rclo;

            //       KONVEKTION

            cbare = hc * (tx - tsk) * adu * (1.0 - facl);
            cclo   = hc * (tx - tcl) * acl;
            csum_temp	= cbare + cclo;

            //       DIFFUSION

            ed    = evap / (rdsk + rdcl) * adu * (1. - wetsk) * (12.-vpts);

            //       ATMUNG

            tex   = 0.47 * tx + 21.0;
            eres = cair * (tx - tex) * rtv;
            vpex   = 6.11 * Math.pow(10.0, (7.45 * tex / (235. + tex)));
            erel = 0.623 * evap  / p * (12. - vpex) * rtv;
            ere_temp   = eres + erel;

            //       ENERGIEBILANZ

            enbal = h + ed + ere_temp + esw + csum_temp + rsum_temp;

            //       ITERATION BEZUEGLICH ta

            if (count1 === 0)  xx = 1.0;
            if (count1 === 1)  xx = 0.1;
            if (count1 === 2)  xx = 0.01;
            if (count1 === 3)  xx = 0.001;
            if (enbal > 0.0)   tx = tx - xx;
            if (enbal < 0.0)   tx = tx + xx;
            switch(true){
                case((enbal <= 0.0) && (enbal2 > 0.0)):
                    return label_160();
                    break;
                case((enbal >= 0.0) && (enbal2 < 0.0)):
                    return label_160();
                    break;
                default:
                    enbal2 = enbal;
                    return label_150();
                    break;
            }
        }
        //label_160();
        function label_160(){
            count1 = count1 + 1;
            switch(true){
                case(count1 === 4):
                    return label_170();
                    break;
                default:
                    return label_150();
                    break;
            }
        }
        //label_170();
        function label_170(){
            return subroutine_PRINT();
        }
    }


    // SUBROUTINE PRINT

    //      SPEICHERUNG DER ERGEBNISSE IN DIE DATEI OUT.TAB
    function subroutine_PRINT(){
        if (count2 === 1) {
            console.log ("Calculation of");
            console.log ("physiologically equivalent temperature P E T");
            console.log ("from the energy performance model MEMI");
            console.log ("Program version: Hoeppe, 1.5.1996");
            console.log ("Workspace in W: " + work + "\ nGroesse: " + ht);
            console.log ("Weight in kg: " + mbody + "\ nAlter: " + age);
            console.log ("Clothes in clo: " + icl + "\ nPosition: standing");
            console.log ("Ta Tmrt V El Ts Tcl Ws B PET");
        }
        // ISSUE OF THE RESULTS ON THE SCREEN
        console.log ("KLIMAPARAMETER");
        console.log ("Air Temperature in C: " + ta);
        output.airTemperature = ta;
        console.log ("Radiation temperature in C: " + tmrt);
        output.radiationTemperature = tmrt;

        console.log ("Steam Pressure in hPa: " + vpa);
        output.steamPressure = vpa;

        console.log ("Wind Speed in m / s: " + v);
        output.windSpeed = v;

        console.log ("KOERPERPARAMETER");
        console.log ("Core Temperature in C: " + tcore [j]);
        output.coreTemperature = tcore [j];

        console.log ("Skin Temperature in C: " + tsk);
        output.skinTemperature = tsk;

        console.log ("Total Water Loss in g / h: " + wsum);
        output.totalWaterLoss = wsum;

        console.log ("Skin Wetting: " + wetsk);
        output.skinWetting = wetsk;

        // WATERFLOW
        console.log ("WAERMEFLUESSE");
        console.log ("Internal Heat in W: " + h);
        output.internalHeat = h;


        console.log ("Radiation balance in W: " + rsum);
        output.radiationBalance = rsum;
        console.log ("Convection in W: " + csum);
        output.convection = csum;
        console.log ("Water Vapor Diffusion in W: " + ed);
        output.waterVaporDiffusion = ed;
        console.log ("Welding Evaporation in W: " + esw);
        output.weldingEvaporation = esw;
        console.log ("Respiration in W: " + ere);
        output.Respiration = ere;
        console.log ("\n");
        console.log ("P E T: " + tx);
        output.pet = tx;
        return output;
    }
}