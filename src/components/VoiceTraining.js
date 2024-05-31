import React, { useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as speechCommands from '@tensorflow-models/speech-commands';

const VoiceTraining = () => {
  const [recognizer, setRecognizer] = useState(null);

  const createModel = async () => {
    const recognizer = speechCommands.create('BROWSER_FFT');
    await recognizer.ensureModelLoaded();
    setRecognizer(recognizer);
  };

  const collect = async (label) => {
    const classLabels = recognizer.wordLabels();
    const labelIndex = classLabels.indexOf(label);
    console.log(`Collecting samples for ${label}...`);
    await recognizer.collectExample(labelIndex);
  };

  const trainModel = async () => {
    recognizer.train();
    console.log('Training complete.');
  };

  const predict = async () => {
    const words = recognizer.wordLabels();
    recognizer.listen(({ scores }) => {
      const highestScoreIndex = scores.indexOf(Math.max(...scores));
      console.log(`Predicted: ${words[highestScoreIndex]}`);
    }, { probabilityThreshold: 0.75 });
  };

  return (
    <div>
      <button onClick={createModel}>Create Model</button>
      <button onClick={() => collect('health_word')}>Collect Health Word</button>
      <button onClick={() => collect('threat_word')}>Collect Threat Word</button>
      <button onClick={trainModel}>Train Model</button>
      <button onClick={predict}>Start Prediction</button>
    </div>
  );
};

export default VoiceTraining;
