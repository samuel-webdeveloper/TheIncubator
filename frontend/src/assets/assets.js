import logo_1 from './logo_1.png'
import dropdown_icon from './dropdown_icon.svg'
import star_icon from './star_icon.svg'
import arrow_icon from './arrow_icon.svg'
import verified_icon from './verified_icon.svg'
import info_icon from './info_icon.svg'
import cross_icon from './cross_icon.png'
import menu_icon from './menu_icon.svg'
import testimonial_image_1 from "./testimonial_image_1.jpg"
import testimonial_image_2 from "./testimonial_image_2.jpg"
import testimonial_image_3 from "./testimonial_image_3.jpg"
import cover_1 from './cover_1.jpeg'
import cover_2 from './cover_2.jpeg'
import cover_3 from './cover_3.jpeg'
import cover_4 from './cover_4.jpeg'
import cover_5 from './cover_5.jpeg'

export const assets = {
    logo_1,
    dropdown_icon,
    arrow_icon,
    cover_1,
    cover_2,
    cover_3,
    cover_4,
    cover_5,
    verified_icon,
    info_icon,
    cross_icon,
    menu_icon,
    testimonial_image_1,
    testimonial_image_2,
    testimonial_image_3,
    star_icon
}

export const commonMenuLinks = [
    { name: "Home", path: "/" },
    { name: "Mentors", path: "/mentee/dashboard/mentors" },
    { name: "About", path: "/about" },
]

export const adminMenuLinks = [
    { name: "Users", path: "/admin/users" },
    { name: "Matches", path: "/admin/matches" },
    { name: "Sessions", path: "/admin/sessions" },
]

export const menteeMenuLinks = [
  { name: "Dashboard", path: "/mentee/dashboard" },
  { name: "Mentors", path: "/mentee/dashboard/mentors" },
  { name: "My Requests", path: "/mentee/dashboard/my-requests" },
  { name: "My Sessions", path: "/mentee/dashboard/my-sessions" },
  { name: "Profile", path: "/mentee/dashboard/profile" },
]

export const mentorMenuLinks = [
  { name: "Dashboard", path: "/mentor/dashboard" },
  { name: "Availability", path: "/mentor/dashboard/availability" },
  { name: "Requests", path: "/mentor/dashboard/requests" },
  { name: "Sessions", path: "/mentor/dashboard/sessions" },
  { name: "Profile", path: "/mentor/dashboard/profile" },
]


