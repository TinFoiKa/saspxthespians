import { useEffect, useState } from "react"
import "./Home.css"


const Home = () => {
    const [data, setData] = useState({})
    /*const showIt = () => {
        const toBeShown = document.getElementsByClassName("content-wrapper")[0];

        const screenPortion = window.innerHeight / 0.3;
      
        const scrolled = (window.scrollY + window.innerHeight);// - (item.offsetHeight/2);
      
          if (toBeShown.offsetTop - window.scrollY < screenPortion) {
            toBeShown.classList.add('content-opacity');
          } else {
            toBeShown.classList.remove('content-opacity');
          }
    }
      
    window.addEventListener('scroll', showIt);*/

    useEffect(
        () => {
            console.log("based")
            const getPageData = async () => {
                fetch("https://sasthespians.aaronli69.workers.dev", {
                    method: "POST",
                    headers: { 
                        "Content-type": "application/json; charset=UTF-8"
                    } 
                })
                .then(response => response.json)
                .then(json => console.log(json))
            }
            

            getPageData()
        }
    , [])
    
    
    return (
        <>
<div className="splash-container">
    <div className="splash">
        <h1 className="splash-head">SAS Puxi Thespians</h1>
        <p className="splash-subhead">
            International Thespians Society Troupe 6818
        </p>
        <p>
            <a href="" className="pure-button pure-button-primary">Watch Our Shows</a>
        </p>
    </div>
</div>

<div className="content-wrapper">
    <div className="content">
        <h2 className="content-head is-center">Shows and Dates</h2>

        <div className="pure-flex">
            <div className="l-box pure-u-1 pure-u-md-1-2 pure-u-lg-1-4">

                <h3 className="content-subhead">
                    <i className="fa fa-rocket"></i>
                    Fall Play
                </h3>
                <p>
                    {/*notion*/ "Notion API is not responding" }
                </p>
            </div>
            <div className="l-box pure-u-1 pure-u-md-1-2 pure-u-lg-1-4">
                <h3 className="content-subhead">
                    <i className="fa fa-mobile"></i>
                    Spring Musical
                </h3>
                <p>
                    {/*notion*/ "Notion API is not responding" }
                </p>
            </div>
        </div>
    </div>

    <div className = "content-even">
        <h2 className="content-head content-head-ribbon is-center">Our Officers</h2>

        <div className="">
            <div className="l-box pure-u-1 pure-u-md-1-2 pure-u-lg-1-4">

                <h3 className="content-subhead">
                    <i className="fa fa-rocket"></i>
                    President
                </h3>
                {/*notion*/ "Notion API is not responding" }
            </div>
            <div className="grid"> 
            <div className="l-box pure-u-1 pure-u-md-1-2 pure-u-lg-1-4">
                <h3 className="content-subhead">
                    <i className="fa fa-mobile"></i>
                    Vice President
                </h3>
                {/*notion*/ "Notion API is not responding" }
            </div>
            <div className="l-box pure-u-1 pure-u-md-1-2 pure-u-lg-1-4">
                <h3 className="content-subhead">
                    <i className="fa fa-mobile"></i>
                    Historian
                </h3>
                {/*notion*/ "Notion API is not responding" }
            </div></div>
            <div className="grid"> 
            <div className="l-box pure-u-1 pure-u-md-1-2 pure-u-lg-1-4">
                <h3 className="content-subhead">
                    <i className="fa fa-mobile"></i>
                    Webmaster
                </h3>
                <p>
                    {/*notion*/ "Notion API is not responding" }
                </p>
            </div>
            <div className="l-box pure-u-1 pure-u-md-1-2 pure-u-lg-1-4">
                <h3 className="content-subhead">
                    <i className="fa fa-mobile"></i>
                    Public Relations
                </h3>
                <p>
                    {/*notion*/ "Notion API is not responding" }
                </p>
            </div></div>
        </div>

    </div>

    <div className="ribbon l-box-lrg pure-g">
        <div className="l-box-lrg is-center pure-u-1 pure-u-md-1-2 pure-u-lg-2-5">
            <img width="300" alt="File Icons" className="pure-img-responsive" src="/img/common/file-icons.png"/>
        </div>
        <div className="pure-u-1 pure-u-md-1-2 pure-u-lg-3-5">

            <h2 className="content-head content-head-ribbon">Laboris nisi ut aliquip.</h2>

            <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                consequat. Duis aute irure dolor.
            </p>
        </div>
    </div>

</div>
        </>
    )
}

export default Home