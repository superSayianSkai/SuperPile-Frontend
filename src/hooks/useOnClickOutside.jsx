import { useEffect } from "react";

// i want to be able to close the modal if i press it anywhere.
// how do i achieve this.
// i would have to listen to the click on the window.
//  how do i know the click isn't the modal
// how do i locate the modal with a click
// and how do i close the modal when i click outside of it

const useOnClickOutside=(ref, handler)=>{
    useEffect(()=>{
        const listener=(event)=>{
            if (!ref.current || ref.current.contains(event.target)){
                return ;
        }
     handler(event)
    }

    document.addEventListener('mousedown',listener);
    document.addEventListener('touchstart',listener);
    return()=>{
        document.removeEventListener('mousedown',listener)
        document.removeEventListener('touchstart',listener)
    }
    }, [ref, handler])
}

export default useOnClickOutside