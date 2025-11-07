import React from "react"
import Title_Description from "../../Components/Common/Title_Description.common";
import Cotton from "../../Components/User/Our_Material/Cotton.component";
import Microfiber from "../../Components/User/Our_Material/Microfiber.component";
import Plastic from "../../Components/User/Our_Material/Plastic.component";
const Our_Material = () => {
  return (
    <>
     
     <Title_Description 
     title={"CAPPAH MATERIAL"} 
     description={"CAPPAH International mainly uses two types of materials (Cotton & Microfiber)for manufacturing of textile range of cleaning products. We ensure High Quality raw for our entire range to deliver best every time. Continuous Improvement is the core element of our development. At CAPPAH International, there are certain focused elements including product development, customer management, Research & Development, which play vital roleto provide us the strength to lead in market. We are empowered with ambitious team of management, skilled labor and insight of product utility.'Knowledge is Light'so read about our concepts, You will surely be an advocate of our excellence in industry."}
      />
      <div className="pb-8 lg:pb-28">
    <Cotton/>
    <Microfiber/>
    <Plastic/>
    </div>

    </>
  )
}

export default Our_Material
