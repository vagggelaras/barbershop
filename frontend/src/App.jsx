import { useState, useEffect } from "react"
import Navigation from "./BookNowComponents/Navigation"
import ServicesSection from "./BookNowComponents/ServicesSection"
import BarbersSection from "./BookNowComponents/BarbersSection"
import MonthDayHourSelection from "./BookNowComponents/MonthDayHourSelection"
import Confirmation from "./BookNowComponents/Confirmation"
import Recap from "./BookNowComponents/Recap"
import SignUpForm from './BookNowComponents/SignUpForm'

import HomePageMain from './HomePageComponents/HomePageMain'
import LightRays from './HomePageComponents/LightRays'

import CardStack from './HomePageComponents/CardStack'
import './HomePageStyles/BounceCards.css'

import FloatingChatButton from './BookNowComponents/Chatbot/FloatingChatButton'
import Recommendations from './RecommendationsComponents/Recommendations'

import useSmoothScroll from './hooks/useSmoothScroll'
import useBookingData from './hooks/useBookingData'
import useChatbotData from './hooks/useChatbotData'

import UserIcon from "./UserSettings/UserIcon"
import UserSettings from "./UserSettings/UserSettings"
import MyAppointments from "./UserSettings/MyAppointments"
import AdminDashboard from "./AdminComponents/AdminDashboard"

import DisplayServices from "./DisplayServicesComponents/DisplayServices"

import { animate, stagger } from 'animejs'

import Footer from "./FooterSection/Footer"

export default function App() {
  const [activeButton, setActiveButton] = useState(0)
  const [userLoggedIn, setUserLoggedIn] = useState(sessionStorage.length)

  // Custom hooks
  useSmoothScroll(activeButton === 0, 800)
  const { services, barbers, barbersData, dataLoading } = useChatbotData()
  const {
    serviceSelected, setServiceSelected,
    serviceDuration, setServiceDuration,
    servicePrice, setServicePrice,
    dateSelected, setDateSelected,
    barberSelected, setBarberSelected,
    timeSelected, setTimeSelected,
    weekDay,
    resetAllSelected,
    handleChatbotServiceSelected,
    handleChatbotBarberSelected,
    handleChatbotDateSelected,
    handleChatbotTimeSelected,
    handleChatbotBooking
  } = useBookingData()

  // Show welcome alert on first load
  // useEffect(() => {
  //   alert("Αν έχεις δει το site αυτό μέσα από το βιογραφικό μου, για να δεις την πλήρη μου δουλειά κάνε login ως admin με email: vaggelis@gmail.com και κωδικό: 123")
  // }, [])

  const handleNavClick = (number) => setActiveButton(number)

  const handleAdminLogin = () => {
    setActiveButton(5) // Admin Dashboard
  }

  const logOutUser = () => {
    setActiveButton(0)
    resetAllSelected()
    sessionStorage.clear()
    setUserLoggedIn(sessionStorage.length)
  }

  const renderComponentInBookNow = () => {
    if (dateSelected) return (
      <Confirmation
        resetAllSelected={resetAllSelected}
        setActiveButton={setActiveButton}
        setDateSelected={setDateSelected}
        dateSelected={dateSelected}
        barberSelected={barberSelected}
        serviceSelected={serviceSelected}
        serviceDuration={serviceDuration}
        servicePrice={servicePrice}
        weekDay={weekDay}
        timeSelected={timeSelected}
      />
    )
    if (barberSelected) return (
      <MonthDayHourSelection
        setBarberSelected={setBarberSelected}
        setDateSelected={setDateSelected}
        setTimeSelected={setTimeSelected}
        weekDay={weekDay}
        barberSelected={barberSelected}
        serviceDuration={serviceDuration}
      />
    )
    if (serviceSelected) return (
      <BarbersSection
        setBarberSelected={setBarberSelected}
        setServiceSelected={setServiceSelected}
        serviceSelected={serviceSelected}
      />
    )
    if (userLoggedIn) return (
      <ServicesSection
        setServiceSelected={setServiceSelected}
        setServiceDuration={setServiceDuration}
        setServicePrice={setServicePrice}
      />
    )
    return <SignUpForm userLoggedIn={userLoggedIn} setUserLoggedIn={setUserLoggedIn} onAdminLogin={handleAdminLogin} />
  }

  // CardStack config
  const teamMembers = [
    { name: "Antony", role: "Senior Barber", image: "/barber1NoBg.png" },
    { name: "Barbara", role: "Hair Stylist", image: "/barber2NoBg.png" },
    { name: "Anna", role: "Color Specialist", image: "/barber3NoBg.png" }
  ]

  return (
    <>

      {!!(activeButton === 0) && (
        <>
          <HomePageMain setActiveButton={setActiveButton} />
          <LightRays
            raysOrigin="top-center"
            raysColor="#ffffffff"
            raysSpeed={1}
            lightSpread={0.8}
            rayLength={2}
            fadeDistance={0.5}
            saturation={0.4}
            followMouse={true}
            mouseInfluence={0.03}
            noiseAmount={0.05}
            distortion={0}
            className="custom-rays"
          />
          <div className="personnelCardsContainer">
            <h1>meet the team</h1>
            <CardStack items={teamMembers} />
          </div>
        </>
      )}

      {!!(activeButton !== 5) && <Navigation
        onButtonClick={handleNavClick}
        activeButton={activeButton}
        userLoggedIn={userLoggedIn}
        logOutUser={logOutUser}
      />}

      {!!(activeButton === 1) && (
        <>
          {serviceSelected && !dateSelected && (
            <Recap
              serviceSelected={serviceSelected}
              barberSelected={barberSelected}
              dateSelected={dateSelected}
              timeSelected={timeSelected}
              weekDay={weekDay.current}
            />
          )}
          <div className="bookingContainer">
            <main>{renderComponentInBookNow()}</main>
          </div>
        </>
      )}

      {!!(activeButton === 2) && (<DisplayServices/>)}

      {!!(activeButton === 3) && <Recommendations />}

      {!!(activeButton === 4) && <UserSettings/>}

      {!!(activeButton === 5) && <AdminDashboard />}

      {!!(activeButton === 6) && <MyAppointments />}

      {!!userLoggedIn && (
        <>
          {!!(activeButton!==5 && activeButton!==6) && <FloatingChatButton
            services={services}
            barbers={barbers}
            barbersData={barbersData}
            dataLoading={dataLoading}
            onServiceSelected={handleChatbotServiceSelected}
            onBarberSelected={handleChatbotBarberSelected}
            onDateSelected={handleChatbotDateSelected}
            onTimeSelected={handleChatbotTimeSelected}
            onBookingComplete={handleChatbotBooking}
          />}
          <UserIcon setActiveButton={setActiveButton} logOutUser={logOutUser} activeButton={activeButton} />
        </>
      )}

      {/* <Footer></Footer> */}

    </>
  )
}
