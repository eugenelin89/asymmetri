import type { Anchors, Pose } from "./types";
export const landmarkIds = ["kelvin-smith","tinkham-veale","peter-lewis","adelbert","amasa-stone","thinkbox","strosacker","veale","clarke","village","village-clocktower","mather-house","law","nursing","medicine","dental","mandel"] as const;
export function initialCampusPose(anchors:Anchors):Pose {
  const a=anchors["kelvin-smith"],p=a.entry||[a.x,a.z+a.depth/2+4];
  return {x:p[0]+Math.sin(a.yaw)*12,z:p[1]+Math.cos(a.yaw)*12,y:0,yaw:a.yaw,pitch:0};
}
export function applyCampusAnchors(anchors:Anchors):Anchors {
  const pose=initialCampusPose(anchors);
  return {...anchors,arrival:{id:"arrival",x:pose.x,z:pose.z,width:1,depth:1,yaw:pose.yaw,entry:[pose.x,pose.z]},spawn:{id:"spawn",x:pose.x,z:pose.z,width:1,depth:1,yaw:pose.yaw}};
}
