import { Fragment } from 'react';

import Head from 'next/head';
import { ObjectId } from 'mongodb';
import { getMongoConnection } from '../../helpers/db-utils';
import MeetupDetail from '../../components/meetups/MeetupDetail';

const MeetupDetails = (props) => {
    return (
        <Fragment>
            <Head>
                <title>{props.meetupData.title}</title>
                <meta
                    name='description'
                    content={props.meetupData.description}
                />
            </Head>
            <MeetupDetail
                image={props.meetupData.image}
                title={props.meetupData.title}
                address={props.meetupData.address}
                description={props.meetupData.description}
            />
        </Fragment>
    );
};

export const getStaticPaths = async () => {
    try {
        const { client, meetupsCollection } = await getMongoConnection();
        const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

        client.close();

        return {
            fallback: 'blocking',
            paths: meetups.map(meetup => ({ params: { meetupId: meetup._id.toString() } }))
        };

    } catch (error) {
        console.log(error);
    };
};

export const getStaticProps = async (context) => {
    const meetupId = context.params.meetupId;

    try {
        const { client, meetupsCollection } = await getMongoConnection();

        const selectedMeetup = await meetupsCollection.findOne({
            _id: ObjectId(meetupId)
        });

        client.close();

        return {
            props: {
                meetupData: {
                    id: selectedMeetup._id.toString(),
                    title: selectedMeetup.title,
                    image: selectedMeetup.image,
                    address: selectedMeetup.address,
                    description: selectedMeetup.description
                }
            }
        };
    } catch (error) {
        console.log(error);
    };
};

export default MeetupDetails;