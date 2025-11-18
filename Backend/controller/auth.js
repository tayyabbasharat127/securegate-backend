const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const geoip = require('geoip-lite');
const fetch = require('node-fetch')
const { calculateriskscore} = require( '../services/riskservice');
const { createloginEvent,Saverisk,saveaction} = require ('../services/logservice');
exports.registeruser = async(req,res)=>{
    try{
     const {name,email,username,password} = req.body;
     const exists = await  prisma.user.findUnique({where:{email}});
     if(existinguser){
        return res.status(400).json({error:'Email already registered'});
     }
     const hashedpassword = await bcrypt.hash(password,10);
     const user = new User({
        name,email,username,password:hashedpassword
     });
     await prisma.user.create({data:{email,name,password:hash}});
     res.status(201).json({message:'User registered Successfully'});
}
catch(error){
    console.error(error);
    res.status(500).json({error:'Registration failed'});
}


exports.login = async (req,res)=>{
   
    try {
        const {email,password} = req.body;
         const ip = req.ip || req.headers['x-forwarded-for'];
        const device = req.headers['user-agent'];
        const user = await prisma.user.findUnique({where:email});
      if(!user) return res.status(401).json({error: 'invalid credientials'});
        const passwordmatch = await bcrypt.compare(password,user.password);
        if(!passwordmatch) return res.status(401).json({error: 'invalid credientials'});
     const last = await prisma.loginEvent.findFirst({where:userId:user.id},orderBy:{logintime:"desc"})
     const {score,reasons,country} = await calculateriskscore(ip,device,last);
     const event = await createloginEvent(userId,country,device, score > 70 ? "BLOCKED":"SUCCESS"); 
     if (score >0) await Saverisk(event.id,score,reasons.join(","));
     if (score >70){
        await saveaction(event.id,"BLOCK LOGIN","HIGH RISK LOGIN DETECTED");
        return res.status(403).json({message:'LOGIN BLOCKED',score,reasons});
     }
        if(!process.env.JWT_SECRET){
            throw new error('JWT IS NOT SET IN ENVIRONMENT VARIABLES');
        }
        const token = JWT.sign(
            {userId:user._id,username:user.username},process.env.JWT_SECRET,{expiresIn:'1hr'} );
        res.status(200).json({token});
 const ip = req.ip || req.headers["x-forwarded-for"];
    const useragent = req.headers["user-agent"];
    const geo =geoip.lookup(ip);
    const vpncheck = await fetch (`https://vpnapi.io/api/${ip}?key=YOURKEY`);
    const vpn =await vpncheck.json();

    let suspicous= false;
    let reasons =[];
    if(geo.country !== lastlogin.country) {
        suspicous = true;
        reasons.push('New Country detected');
    }
    if(vpn.security.vpn){
        suspicous = true;
        reasons.push('VPN Detected');
    }
    if(useragent !==lastlogin.device){
        suspicous = true;
        reasons.push('New device detected')
    }
    if(suspicous) {
        return res.json({
            message:'Suspcious login detected',
            reasons,
            ip,
            location:geo
        });
    }
    res.json({
        message: "login successful",
        ip,
        location:geo
    });

        
    } catch (error) {
        console.error('Login error',error);
        res.status(500).json({error:error.message || 'Auth failed'})
        
    }
}
};