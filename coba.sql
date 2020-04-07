select * 
        from (
        
                (   
                    select VictimID, Age as VictimAge, CurrentShelterID
                    from victim
                ) as victim_dashboard
                JOIN
                (
                    select * 
                    from (
                            (select shelter.ShelterID as ShelterID, shelter.Name ShelterName, shelter.Latitude as ShelterLatitude, shelter.Longitude as ShelterLongitude 
                            from shelter) as shelter_dash JOIN
                            ( select disaster.DisasterID as DisasterID, disaster.Name as DisasterName, disaster.Scale as DisasterScale, disaster.Latitude as DisasterLatitude, disaster.Longitude as DisasterLongitude
                            from disaster) as disaster_dash
                        on shelter_dash.ShelterID = disaster_dash.DisasterID	
                    )
                ) as shelter_disaster_dashboard
                on victim_dashboard.CurrentShelterID = shelter_disaster_dashboard.ShelterID
            
        );