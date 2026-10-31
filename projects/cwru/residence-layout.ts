export const residenceFloor = 4.2;
export const residenceRooms = Array.from({length:5},(_,i)=>({id:String.fromCharCode(65+i),x:(i-2)*2.925,width:2.925,depth:i<3?5.94:3.15,beds:i<3?2:1,doorZ:1.55}));
export const residenceLift = {minX:5.6,maxX:7.6,minZ:-6.4,maxZ:-3.8};
