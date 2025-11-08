import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './Layout'
import MainPage from './MainPage'
import MatchListPage from './pages/MatchListPage'
import MatchPage from './pages/MatchPage'
import AboutPage from './pages/AboutPage'
import HeroListPage from './pages/HeroListPage'
import HeroPage from './pages/HeroPage'
import PlayerPage from './pages/PlayerPage'
import PlayerListPage from './pages/PlayerListPage'
import LogsPage from './pages/LogsPage'
import MMRPage from './pages/MMRPage'
import ItemListPage from './pages/ItemListPage'
import ItemPage from './pages/ItemPage'

function App() {

  return (
    <Routes>
		<Route path="/" element={<Layout/>}>
			<Route path="/" element={<MainPage/>}/>
			<Route path="/match/:id" element={<MatchPage/>}/>
			<Route path="/heroes" element={<HeroListPage/>}/>
			<Route path="/hero/:name" element={<HeroPage/>}/>
			<Route path="/players" element={<PlayerListPage/>}/>
			<Route path="/player/:id" element={<PlayerPage/>}/>
			<Route path="/items" element={<ItemListPage/>}/>
			<Route path="/item/:name" element={<ItemPage/>}/>
			<Route path="/mmr" element={<MMRPage/>}/>
			<Route path="/about" element={<AboutPage/>}/>
			{/* <Route path="/admin/logs" element={<LogsPage/>}/> */}
			<Route path="*" element={<h1><center>404 Not Found</center></h1>}/>
		</Route>
	</Routes>
  )
}

export default App
