import { Footer, FooterCopyright } from 'flowbite-react'
import React from 'react'
import { Link } from 'react-router-dom'
import {BsFacebook,BsInstagram,BsTwitter,BsGithub,BsDribbble} from 'react-icons/bs'

export default function FooterComp() {
  return (
    <Footer container className='border border-t-8 border-teal-500'>
        <div className=" w-full">
            <div className="max-w-7xl mx-auto">
                <div className="">
                <Link to="/" className='self-center whitespace-nowrap text-xl md:text-sm font-semibold'>
                    <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Destinykers</span>Blog
                 </Link>
                </div>
                <div className="mt-8">
                    <div className='grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6'>
                    <div>
                    <Footer.Title title='About'/>
                    <Footer.LinkGroup col>
                    <Footer.Link
                        href='#'
                        target='_blank'
                        rel='noopener noreferrer'
                        >
                            100 JS Projects
                    </Footer.Link>
                    <Footer.Link
                        href='#'
                        target='_blank'
                        rel='noopener noreferrer'
                        >
                        DestinyKers Blog
                    </Footer.Link>
                    </Footer.LinkGroup>
                    </div>
                    <div>
                    <Footer.Title title='Follow Us'/>
                    <Footer.LinkGroup col>
                    <Footer.Link
                        href='#'
                        target='_blank'
                        rel='noopener noreferrer'
                        >
                            Github
                    </Footer.Link>
                    <Footer.Link
                        href='#'
                        target='_blank'
                        rel='noopener noreferrer'
                        >
                        Discord
                    </Footer.Link>
                    </Footer.LinkGroup>
                    </div>
                    <div>
                    <Footer.Title title='legal'/>
                    <Footer.LinkGroup col>
                    <Footer.Link>
                            Privacy
                    </Footer.Link>
                    <Footer.Link>
                        Terms & conditions
                    </Footer.Link>
                    </Footer.LinkGroup>
                    </div>
                    </div>
                </div>
                <Footer.Divider/>
                <div className="justify-center">
                    <Footer.Copyright href='#' by="Destinyker Blog" year={new Date().getFullYear()}/>
                </div>
                <div className="flex gap-6 justify-center mt-4">
                    <Footer.Icon href='#' icon={BsFacebook}/>
                    <Footer.Icon href='#' icon={BsInstagram}/>
                    <Footer.Icon href='#' icon={BsTwitter}/>
                    <Footer.Icon href='#' icon={BsGithub}/>
                    <Footer.Icon href='#' icon={BsDribbble}/>

                </div>
            </div>
        </div>
    </Footer>
  )
}
