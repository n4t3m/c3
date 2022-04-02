import React from 'react';
import logo from './logo.svg';
import './App.css';

import CardView from './components/cardview';
import { Paper } from '@mui/material';
import Container from '@mui/material/Container';

function App() {
	return (
		<Container maxWidth={false}>
			<Container maxWidth='sm'>
				<CardView
					hostname='hugo'
					IP='127.0.0.1'
					cmdQueue={['ls', 'echo']}
					UUID={'uuid'}
					pollRate={5}
					changeFcn={() => {
						console.log('changed data');
						return true;
					}}
					status={true}
				/>
			</Container>
		</Container>
	);
}

export default App;
