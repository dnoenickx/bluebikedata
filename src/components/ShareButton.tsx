import { faShareFromSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Transition } from '@headlessui/react';
import classNames from 'classnames';
import { v4 as uuidv4 } from "uuid";
import React, { Fragment, useEffect, useState } from 'react';
import { saveShape } from '../api/shapes';
import { useMapStore } from '../store/MapStore';
export const ShareButton = () => {

    const [shareID, setShareID] = useState<string | undefined>(undefined);
    const [showMsg, setShowMsg] = useState(false);
    const mapStore = useMapStore((store) => store)
    const isShapeCreated = !mapStore.startShape?.length;
    useEffect(() => {
        if (showMsg) {
            setTimeout(() => setShowMsg(false), 1500)
        }

    }, [showMsg])

    const saveShapeById = async () => {
        setShowMsg(true)
        const url = new URL(window.location.toString())
        if (shareID) {
            url.searchParams.set('id', shareID)
            navigator.clipboard.writeText(url.toString())
        }
        if (!shareID && mapStore.startShape?.length) {
            const newID = uuidv4().slice(0, 8);
            url.searchParams.set('id', newID)
            navigator.clipboard.writeText(url.toString())
            await saveShape(mapStore.startShape, newID)
            setShareID(newID)
        } else {
            navigator.clipboard.writeText(url.toString())
        }

    }

    useEffect(() => {
        setShareID(undefined)
    }, [mapStore.startShape])

    return (
        <div className="flex flex-row py-1 border box-border border-gray-600 rounded-md hover:bg-gray-500 relative">
            <button
                className={classNames(
                    !isShapeCreated ? "text-neutral-700" : "text-neutral-100",
                    "rounded-full gap-2 flex flex-row px-10 items-center py-[2px]"
                )}
                onClick={saveShapeById}
            >
                <FontAwesomeIcon icon={faShareFromSquare} className={classNames(isShapeCreated ? "text-neutral-100" : "text-neutral-700", "h-4 w-4 cursor-pointer")} />

                <p>Share</p>

            </button>
            <div className="absolute top-0 left-0 overflow-hidden h-full w-full rounded-md pointer-events-none	border-gray-500 border border-transparent box-border">
                <Transition
                    as={Fragment}
                    show={showMsg}
                    enter="transform transition ease-in-out duration-[600ms]"
                    enterFrom="opacity-0 scale-50 bg-gray-800"
                    enterTo="opacity-100 scale-100 bg-gray-700"
                    leave="transform duration-[600ms] transition ease-in-out"
                    leaveFrom="opacity-100 bg-gray-700 text-gray-200"
                    leaveTo=" scale-150 bg-gray-500 text-gray-500"
                >
                    <div className="absolute top-0 left-0 h-full w-full rounded-[.25rem] text-gray-200 rounded-smbg-gray-700 shadow-lg items-center justify-center flex pointer-events-auto select-none" >
                        <p className=" text-sm">Copied to clipboard</p>
                    </div>
                </Transition>
            </div>
        </div >)
}