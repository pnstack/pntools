import React from 'react';

export const RandomPasswordTool = () => {
  const [passwordResult, setPasswordResult] = React.useState<string>('');

  const handleRandomPassword = () => {
    // Random password
    const chars = '0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const passwordLength = 12;
    let password = '';
    for (let i = 0; i <= passwordLength; i++) {
      const randomNumber = Math.floor(Math.random() * chars.length);
      password += chars.substring(randomNumber, randomNumber + 1);
    }
    setPasswordResult(password);
  };

  return (
    <div className="h-full w-full max-w-lg">
      <div className="flex flex-row space-x-3 p-2">
        <div className="flex-1 rounded-full bg-slate-200 px-5 py-3">
          <input
            value={passwordResult}
            className="w-full bg-transparent outline-none"
            type="text"
          />
        </div>
        <button onClick={handleRandomPassword} className="rounded-md bg-green-300 px-3 py-2">
          Random
        </button>
      </div>
    </div>
  );
};
