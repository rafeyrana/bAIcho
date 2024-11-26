interface WaitListData {
  email: string;
  name: string;
  position: string;
  use_case: string;
}

export const handleWaitList = async (data: WaitListData): Promise<void> => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/waitlist/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to submit waitlist entry');
    }

    const result = await response.json();
    console.log('Waitlist submission successful:', result);
  } catch (error) {
    console.error('Error submitting to waitlist:', error);
    throw error;
  }
};
