import React from 'react';
import { PageComponent } from '..';

interface AboutProps {
  yasin: string;
}

const About: PageComponent<AboutProps> = props => {
  return <h1>About {props.yasin}</h1>;
};

About.getInitialProps = async () => {
  throw new Error('About Test Error');
};

export default About;
