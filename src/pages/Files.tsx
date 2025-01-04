import { useState } from "react"

const Playlists = () => {
    return (

    )
}

const Files = () => {
    // this should really be determined by Notion
    const playlistToID = new Map<string, string>();
    playlistToID.set("Promotions", "PLzuGSyZPKk2ZopbHF9BgsSesRSXd_DV04")
    playlistToID.set("Plays", "PLzuGSyZPKk2YYtK_eLHMPZRgsBlCcAWsV")
    playlistToID.set("Musicals", "PLzuGSyZPKk2bZoITlKmExYw7xBA1l5BFW")
    playlistToID.set("Fringe", "PLzuGSyZPKk2b_NKPMXXPfqwyKWwtcYN6P")
    playlistToID.set("Other", "PLzuGSyZPKk2YozdFXwIAov-KX9Z_xwvGy")

    const playlistList = playlistToID.keys();

    return (
        <>
        </>
    )
}

export default Files