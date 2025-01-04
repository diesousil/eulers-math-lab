'use client'
import React, { FC } from 'react';
import { ResultDisplayWrapper } from './ResultDisplay.styled';
import Result from '@/types/Result';

interface ResultDisplayProps {
   data: Result
}

const ResultDisplay: FC<ResultDisplayProps> = (props) => (
 <ResultDisplayWrapper data-testid="ResultDisplay">
      {props.data.result}
 </ResultDisplayWrapper>
);

export default ResultDisplay;
