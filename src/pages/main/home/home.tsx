import { useEffect, useState } from "react"

//components
import Setup from "../components/setup/setup";

export default function Home(){
    const [setupWasShown, setSetupWasShown] = useState(false);

    useEffect(() => {
        setSetupWasShown(false);
    }, []);

    return (
        <>
        {!setupWasShown && <Setup/>}
        </>
    )
}
