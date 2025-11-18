import geoip from "geoip-lite";
import fetch fron "node-fetch";
export const calculateriskscore = async(ip,device,lastlogin)=>{
    let score = 0; 
    let reasons =[];
    const geo =geoip.lookup(ip);
    const country =geo?.country ?? "Unknown";
    const vpnreq = await fetch ('');
    const vpn = await vpnReq.json();
    if(vpn?.security?.vpn){
        score+= 30;
        reasons.push("VPN DETECTED");
    }
    if(lastlogin && lastlogin.location !==country){
        score+=40;
        reasons.push("New Country detected");
    }
    if(lastlogin && lastlogin.device !==device){
        score+=20;
        reasons.push("New Device detected");
    }
    return {score,reasons,country};
}