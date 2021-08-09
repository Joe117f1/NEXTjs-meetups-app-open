import { Fragment } from 'react';
import Head from 'next/head';
import { getMongoConnection } from '../helpers/db-utils';
import MeetupList from '../components/meetups/MeetupList';

const HomePage = (props) => {
  return (
    <Fragment>
      <Head>
        <title>Yoav&#39;s Meetapp</title>
        <meta
          name='description'
          content='Browse for meetups happening near you or create new meetup'
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
};

export const getStaticProps = async () => {
  try {
    const { client, meetupsCollection } = await getMongoConnection();
    const meetups = await meetupsCollection.find().toArray();

    client.close();

    return {
      props: {
        meetups: meetups.map(meetup => ({
          title: meetup.title,
          image: meetup.image,
          address: meetup.address,
          id: meetup._id.toString(),
        }))
      },
      revalidate: 10
    };

  } catch (error) {
    return { notFound: true };
  }
};
export default HomePage;