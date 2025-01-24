import { useEffect, useState } from "react"
import "./Home.css"
import { databaseQuery } from "../handlers/notion-handler"


const Home = () => {
    const [photos, setPhotos] = useState()
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
                const websitePhotos = "Media"
                console.log("Media")
                console.log("{Displayed chk:true}")
                const query = new databaseQuery("{Displayed chk:true}", websitePhotos)
                const response = await (await query.execute()).json()
                //console.log(response)
                setPhotos(response)
            }
        
            
            getPageData()
        }
    , [])
    
    const getPhotoLink = (tag: number) : string => {
        if(photos != undefined){
            // dir = results[0].properties["Files & Media"].files[0]
            // 0 is PR, 1 is webmaster, 2 is historian, 3 is VP, 4 is Bgnd, 5 is Spring Musical, 6 is Pres, 7 is fall play, 
            const file = (photos as object).results[tag].properties["Files & Media"].files[0]
            try {
                return file.file.url
            } catch {
                return ""
            }
        }
        return ""
    }
    
    const getInsert = (tag: number, fixedSize: boolean = false) => {
        const url = getPhotoLink(tag)
        
        return url != "" ?
        <img src={url} className="images" style={fixedSize ? {
            padding: '20px',
            width: '300px',
            height: '400px',
            objectFit: 'cover'
        } : undefined}></img> 
        : 
        "waiting for a response from Notion API..."
    }
    
    return (
        <>


<div className="splash-container">
<div className = "blur-line"><div className = "inner-fill"></div></div>
<div className="splash-image">{getInsert(4)}</div>
    <div className="splash">
        
        <h1 className="splash-head">SAS Puxi Thespians</h1>
        <p className="splash-subhead">
            International Thespians Society Troupe 6818
        </p>
        <p className="padtop">
            <a href="" className="pure-button pure-button-primary">Watch Our Shows</a>
        </p>
    </div>
</div>

<div className="content-wrapper">
    <div className="content">
        <h2 className="content-head is-center">Shows and Dates</h2>

        <div className="pure-flex" style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '2rem',
            textAlign: 'center'
        }}>
            <div className="show-box l-box pure-u-1 pure-u-md-1-2 pure-u-lg-1-4" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <h3 className="content-subhead">
                    <i className="fa fa-rocket"></i>
                    Fall Play
                </h3>
                {getInsert(7, true)} 
            </div>

            <div className="show-box l-box pure-u-1 pure-u-md-1-2 pure-u-lg-1-4" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <h3 className="content-subhead">
                    <i className="fa fa-mobile"></i>
                    Spring Musical
                </h3>
                {getInsert(5, true)} 
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
                <p>{getInsert(6)}</p>
            </div>
            <div className="grid"> 
            <div className="l-box pure-u-1 pure-u-md-1-2 pure-u-lg-1-4">
                <h3 className="content-subhead">
                    <i className="fa fa-mobile"></i>
                    Vice President
                </h3>
                <p>{getInsert(3)} </p>
            </div>
            <div className="l-box pure-u-1 pure-u-md-1-2 pure-u-lg-1-4">
                <h3 className="content-subhead">
                    <i className="fa fa-mobile"></i>
                    Historian
                </h3>
                <p>{getInsert(2)}</p>
                
            </div></div>
            <div className="grid"> 
            <div className="l-box pure-u-1 pure-u-md-1-2 pure-u-lg-1-4">
                <h3 className="content-subhead">
                    <i className="fa fa-mobile"></i>
                    Webmaster
                </h3>
                <p>
                    {getInsert(1)} 
                </p>
            </div>
            <div className="l-box pure-u-1 pure-u-md-1-2 pure-u-lg-1-4">
                <h3 className="content-subhead">
                    <i className="fa fa-mobile"></i>
                    Public Relations
                </h3>
                <p>
                    {getInsert(0)} 
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