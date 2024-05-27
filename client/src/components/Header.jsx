import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react'
import React from 'react'
import {Link,useLocation} from 'react-router-dom';
import{AiOutlineSearch} from 'react-icons/ai';
import {FaMoon,FaSun} from 'react-icons/fa'
import { useSelector,useDispatch} from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
export default function Header() {
  const {theme}=useSelector((state)=>state.theme)
  const path=useLocation().pathname;
  const dispatch=useDispatch()
  const {currentUser}=useSelector(state=>state.user)
  return (
    <Navbar className='border-b-2'>
      <Link to="/" className='self-center whitespace-nowrap text-xl md:text-sm font-semibold'>
      <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Destinykers</span>Blog
      </Link>
      <form className='flex'>
      <TextInput
      type='text'
      placeholder='Search'
      rightIcon={AiOutlineSearch}
      className='hidden lg:inline'
      />
      <Button className='w-12 h-10 lg:hidden' color='gray' pill>
        <AiOutlineSearch/>
      </Button>
      </form>
      <div className="flex gap-2 md:order-2">
        <Button className='w-12 h-10 hidden sm:inline' color='gray' pill onClick={
          ()=>dispatch(toggleTheme())}>
            {theme==='light' ? <FaMoon/> : <FaSun/>}
        </Button>
        {
          currentUser ? (
            <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
              alt='user'
              img={currentUser.profilePicture}
              rounded/>
            }
            >
              <Dropdown.Header>
                <span className='text-sm block'>@{currentUser.userName}</span>
                <span className='text-sm block font-medium truncate'>{currentUser.email}</span>
              </Dropdown.Header>
              <Link to='dashboard?tab=profile'>
                <Dropdown.Item>Profile</Dropdown.Item>
                <Dropdown.Divider/>
                <Dropdown.Item>Sign out</Dropdown.Item>
              </Link>
            </Dropdown>
          ):
          (
            <Link to="/sign-in">
            <Button gradientDuoTone='purpleToBlue' outline>
              SignIn
            </Button>
            </Link>
          )
        }
        <Navbar.Toggle/>
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path==='/'} as={"div"}>
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path==='/about'} as={"div"}>
          <Link to="/about">About</Link>
        </Navbar.Link>
        <Navbar.Link active={path==='/projects'} as={"div"}>
          <Link to="/projects">Projects</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  )
}
