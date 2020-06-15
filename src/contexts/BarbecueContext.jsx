import React, { createContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import { getBarbecue, createMember } from 'logic/requests/barbecue';
import { useParams } from 'react-router-dom';

export const BarbecueContext = createContext({});

const initialState = {
  members: [],
  date: '',
  title: '',
  description: '',
  notes: '',
};

export function BarbecueProvider({ children }) {
  const { id } = useParams();
  const [barbecue, setBarbecue] = useState(initialState);
  const [loaded, setLoaded] = useState(false);

  const fetch = useCallback(async () => {
    setLoaded(false);
    const { data } = await getBarbecue(id);
    setBarbecue(data);
    setLoaded(true);
  }, [id]);

  async function submitCreateMember(data) {
    setLoaded(false);
    await createMember(data);
    fetch(data.barbecue);
  }

  useEffect(() => {
    fetch();
  }, [fetch]);

  const publicValue = { barbecue, loaded, fetch, submitCreateMember };

  return (
    <BarbecueContext.Provider value={publicValue}>
      {children}
    </BarbecueContext.Provider>
  );
}

BarbecueProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default BarbecueProvider;
