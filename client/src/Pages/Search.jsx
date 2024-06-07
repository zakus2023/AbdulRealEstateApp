import React, { useEffect, useState } from "react";
import "./Search.css";
import { useNavigate, useParams } from "react-router-dom";
import ListingItem from "../Components/ListingItem";

export default function Search() {
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState([]);
  const navigate = useNavigate();

  console.log(listing);

  const [sidebarData, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });
  console.log(sidebarData);
  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSidebardata({
        ...sidebarData,
        type: e.target.id,
      });
    }

    if (e.target.id === "searchTerm") {
      setSidebardata({ ...sidebarData, searchTerm: e.target.value });
    }
    if (
      e.target.id === "furnished" ||
      e.target.id === "parking" ||
      e.target.id === "offer"
    )
      setSidebardata({
        ...sidebarData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";
      const order = e.target.value.split("_")[1] || "desc";
      setSidebardata({
        ...sidebarData,
        sort,
        order,
      });
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furmishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      offerFromUrl ||
      furmishedFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furmishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListing = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/search?${searchQuery}`);
      const data = await res.json();
      setListing(data);
      setLoading(false);
    };
    fetchListing();
  }, [location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("type", sidebarData.type);
    urlParams.set("parking", sidebarData.parking);
    urlParams.set("furnished", sidebarData.furnished);
    urlParams.set("offer", sidebarData.offer);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("order", sidebarData.order);
    const searchQuery = urlParams.toString();

    navigate(`/search?${searchQuery}`);
  };

  return (
    <div className="main">
      <div className="left-search">
        <form onSubmit={handleSubmit}>
          <div className="inner-left">
            <div className="search-term">
              <span>Search Term</span>
              <input
                type="text"
                placeholder="Search..."
                value={sidebarData.searchTerm}
                id="searchTerm"
                onChange={handleChange}
              />
            </div>
            <div className="checks">
              <div className="check">
                <span>Type:</span>
                <input
                  type="checkbox"
                  checked={sidebarData.type === "all"}
                  id="type"
                  onChange={handleChange}
                />
                <span>Rent & Sale</span>
              </div>
              <div className="check">
                <input
                  type="checkbox"
                  checked={sidebarData.type === "rent"}
                  id="rent"
                  onChange={handleChange}
                />
                <span>Rent</span>
              </div>
              <div className="check">
                <input
                  type="checkbox"
                  checked={sidebarData.type === "sale"}
                  id="sale"
                  onChange={handleChange}
                />
                <span>Sale</span>
              </div>
              <div className="check">
                <input
                  type="checkbox"
                  checked={sidebarData.offer}
                  id="offer"
                  onChange={handleChange}
                />
                <span>Offer</span>
              </div>
              <span>Facilities</span>
              <div className="check">
                <input
                  type="checkbox"
                  checked={sidebarData.parking}
                  id="parking"
                  onChange={handleChange}
                />
                <span>Parking</span>
              </div>
              <div className="check">
                <input
                  type="checkbox"
                  checked={sidebarData.furnished}
                  id="furnished"
                  onChange={handleChange}
                />
                <span>Furnished</span>
              </div>
            </div>
            <div className="combo">
              <span>Sort</span>
              <select
                name=""
                id="sort_order"
                defaultValue={"created_at_desc"}
                onChange={handleChange}
              >
                <option value="regularPrice_desc">Price high to low</option>
                <option value="regularPrice_asc">Price low to high</option>
                <option value="createdAt_desc">Latest</option>
                <option value="createdAt_asc">Oldest</option>
              </select>
            </div>
            <button>Search</button>
          </div>
        </form>
      </div>

      <div className="right-search">
        <div className="inner-right">
          <span>Listing results</span>
          <hr />
          <div className="search-results">
            {!loading && listing.length === 0 && (
              <p>No listing found for this sea</p>
            )}
            {loading && <p>Loading ...</p>}

            {!loading &&
              listing &&
              listing.map((listings) => (
                <ListingItem key={listings._id} listings={listings} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
