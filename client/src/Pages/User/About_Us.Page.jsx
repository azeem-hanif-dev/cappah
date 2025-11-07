import React from "react"
import Hero from "../../Components/User/About_Us/Hero_About.component"

import About_Maps from "../../Components/User/About_Us/About_Maps.component"
import Success_Story from "../../Components/User/About_Us/Success_Story.component"
import Video_Content from "../../Components/User/About_Us/Video_Content.component"
const About_Us = () => {
  return (
    <>
     <Hero/>
     <Video_Content/>
      <About_Maps/>
      <Success_Story/>
    </>
  )
}

export default About_Us
