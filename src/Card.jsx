import React, { useEffect, useState } from "react";
import supabase from "../SUpabaseclient";
import Communitychest from "./Chest";
import Chance from "./Chance";

function Draw_card({triggered}){  
    const[showChancecard,setshowChancecard]=useState(false);
    const[showCommunitychestcard,setshowCommunitychestcard]=useState(false)  
    useEffect(()=>{
        const Card_type=async()=>{
            const {data,error}=await supabase
            .from('players')
            .select('position')
            .limit(1);
            if(error){
                console.error("failed to fetch:",error);
                return;
            }
            if(data&&data.length>0){
                const position=data[0].position

                if([7,22,36].includes(position)){
                    setshowChancecard(true);
                    setshowCommunitychestcard(false);
                }

                else if([2,17,33].includes(position)){
                    setshowChancecard(false);
                    setshowCommunitychestcard(true);
                }
                else{
                    setshowChancecard(false);
                    setshowCommunitychestcard(false);
                }
            }          
            };
        
            if(triggered){
                Card_type()
            }
    },[triggered]);
    return(
        <div>
           {showChancecard&&<Chance triggered={true} />} 
           {showCommunitychestcard&&<Communitychest triggered={true} />}
        </div>
    )

}

export default Draw_card