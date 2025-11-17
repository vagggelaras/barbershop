import { useState } from "react"
import Navigation from "./BookNowComponents/Navigation"
import ServicesSection from "./BookNowComponents/ServicesSection"
import BarbersSection from "./BookNowComponents/BarbersSection"
import MonthDayHourSelection from "./BookNowComponents/MonthDayHourSelection"
import Confirmation from "./BookNowComponents/Confirmation"
import Recap from "./BookNowComponents/Recap"
import SignUpForm from './BookNowComponents/SignUpForm'

import HomePageMain from './HomePageComponents/HomePageMain'
import LightRays from './HomePageComponents/LightRays'
import UserIcon from "./HomePageComponents/UserIcon"
import BounceCards from './HomePageComponents/BounceCards'
import './HomePageStyles/BounceCards.css'

import FloatingChatButton from './BookNowComponents/Chatbot/FloatingChatButton'
import Recommendations from './RecommendationsComponents/Recommendations'

import useSmoothScroll from './hooks/useSmoothScroll'
import useBookingData from './hooks/useBookingData'
import useChatbotData from './hooks/useChatbotData'

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

  const handleNavClick = (number) => setActiveButton(number)

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
    return <SignUpForm userLoggedIn={userLoggedIn} setUserLoggedIn={setUserLoggedIn} />
  }

  // BounceCards config
  const bounceCardsImages = ["/barber1NoBg.png", "/barber2NoBg.png", "/barber3NoBg.png"]
  const bounceCardsTransforms = [
    "rotate(0deg) translate(-110px)",
    "rotate(-5deg)",
    "rotate(5deg) translate(110px)"
  ]

  return (
    <>
      <Navigation
        onButtonClick={handleNavClick}
        activeButton={activeButton}
        userLoggedIn={userLoggedIn}
        logOutUser={logOutUser}
      />

      {activeButton === 1 && (
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

      {activeButton === 0 && (
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
            <h1>Meet the team</h1>
            <BounceCards
              className="custom-bounceCards"
              images={bounceCardsImages}
              animationDelay={1.2}
              animationStagger={0}
              easeType="elastic.out(2, 1)"
              transformStyles={bounceCardsTransforms}
              enableHover={true}
            />
          </div>
        </>
      )}

      {activeButton === 3 && <Recommendations />}

      {userLoggedIn && (
        <>
          <FloatingChatButton
            services={services}
            barbers={barbers}
            barbersData={barbersData}
            dataLoading={dataLoading}
            onServiceSelected={handleChatbotServiceSelected}
            onBarberSelected={handleChatbotBarberSelected}
            onDateSelected={handleChatbotDateSelected}
            onTimeSelected={handleChatbotTimeSelected}
            onBookingComplete={handleChatbotBooking}
          />
          <UserIcon logOutUser={logOutUser} />
        </>
      )}
    </>
  )
}
