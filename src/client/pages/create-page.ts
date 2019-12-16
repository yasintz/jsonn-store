import React from 'react';
import { GetInitialData } from '.';

interface ResultType {
  component: React.ComponentType<any>;
  getInitialData?: GetInitialData;
}

const createPage: (c: React.ComponentType<any>, g?: GetInitialData) => ResultType = (component, getInitialData) => ({
  component,
  getInitialData,
});

export default createPage;
