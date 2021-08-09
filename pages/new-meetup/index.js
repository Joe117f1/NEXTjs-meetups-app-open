import { Fragment, useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import NewMeetupForm from '../../components/meetups/NewMeetupForm';

const sendContactData = async (meetupDetails) => {
  const response = await fetch('/api/new-meetup', {
    method: 'POST',
    body: JSON.stringify(meetupDetails),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong..');
  }
};

const NewMeetupPage = () => {
  const [requestStatus, setRequestStatus] = useState();
  const router = useRouter();

  useEffect(() => {
    if (requestStatus === 'success' || requestStatus === 'error') {
      const timer = setTimeout(() => {
        setRequestStatus(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [requestStatus]);

  const addMeetupHandler = async (enteredMeetupData) => {
    setRequestStatus('pending');
    try {
      await sendContactData(enteredMeetupData);
      setRequestStatus('success');
      router.push('/');
    } catch (error) {
      setRequestStatus('error');
      setErrorMessage(error.message);
    }
  };

  return (
    <Fragment>
      <Head>
        <title>Add a new meetup</title>
        <meta
          name='description'
          content='Add your own Meetup and create amazing opportunities'
        />
      </Head>
      <NewMeetupForm isLoading={requestStatus === 'pending'} onAddMeetup={addMeetupHandler} />
    </Fragment>
  );
};

export default NewMeetupPage;
