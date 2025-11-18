export const createloginEvent =  async (userid,ip,location,device,status)=>{
    return prisma.loginEvent.create({
        data:{userid,ip,location,device,status}
    });
}
export const Saverisk = async(eventid,score,reason)=>{
    return prisma.riskScore.create({loginEventId:eventid,score,reason})
};
export const saveaction = async(eventid,type,details)=>{
    return prisma.securityaction.create({data:{logineventId:eventid,actiontype:type,details}});
};