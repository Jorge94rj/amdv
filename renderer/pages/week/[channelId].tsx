import { useEffect, useState } from 'react';
import { AssetItem, AssetList } from '../../styled-components/week.style';
import { dayNames, IDay } from '../../types';
import Card from '../../components/Card';
import Image from 'next/image';
import ImageIcon from '../../public/image.svg';
import { useRouter } from 'next/router';
import { IconWrapper } from '../../components/Card/index.style';

const Week = () => {
  const router = useRouter();
  const { channelId } = router.query;
  const [days, setDays] = useState<IDay[]>([]);

  useEffect(() => {
    if (channelId) {
      getDays();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId]);

  const getDays = async () => {
    const req = await fetch(`/api/week/${channelId}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json'
      },
    })

    const res = await req.json();
    setDays(res.days);
  }

  const getDayName = (day: number): number => {
    return dayNames[day as keyof {}]
  }

  return (
    <>
      <h3>
        Week
      </h3>
      <AssetList>
        {
          days.map((day) => (
            <Card key={day.id} clickable={true}>
              <AssetItem onClick={() => router.push({
                  pathname: `/block/${channelId}/${day.id}`,
                  query: {dayName: getDayName(day.day)}
                })}>
                <IconWrapper noMargin={true}>
                  <Image
                    src={ImageIcon}
                    alt="type"
                    width="64"
                    height="64"
                  />
                </IconWrapper>
                <h5>{getDayName(day.day)}</h5>
              </AssetItem>
            </Card>
          ))
        }
      </AssetList>
    </>
  )
}

export default Week;