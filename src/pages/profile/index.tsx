import React, { useEffect, useRef, useState } from "react";
import { Breadcrumb, Button, Input, Space, Table, message } from "antd";
import type { TableColumnsType, InputRef, TableColumnType } from "antd";
import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";
import { customDataProvider } from "../../providers/customDataProvider";
import { useDocumentTitle } from "@refinedev/react-router/.";
import { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";

interface MemberProfileListProps {
  key: string;
  id: string;
  name: string;
  membershipCategory: string;
  membershipID: string;
}
type DataIndex = keyof MemberProfileListProps;

export const MembersProfile = () => {
  const [data, setData] = useState<MemberProfileListProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 100,
  });

  // 🔍 Search Functionality
  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<MemberProfileListProps> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button type="link" size="small" onClick={() => close()}>
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ?.toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        const response: any = await customDataProvider.getList({
          resource: "membership",
        });

        const formattedData = response.data.data.map(
          (item: any, index: number) => ({
            key: item.id,
            id: item.id,
            name: item.name,
            membershipCategory: item.membershipCategory
              ? item.membershipCategory.toUpperCase()
              : "N/A",
            membershipID: item.membershipID,
          })
        );

        setData(formattedData);
      } catch (error) {
        console.error("Failed to fetch members:", error);
        message.error("Could not load member profiles.");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const handleDownload = async (id: string, membershipID: string) => {
    const API_URL = import.meta.env.VITE_API_URL;
    try {
      const response = await fetch(
        `${API_URL}/membership/generate-barcode/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${membershipID}.png`;
      a.click();
    } catch (err) {
      console.error("Download failed", err);
      message.error("Failed to download barcode.");
    }
  };

  const columns: TableColumnsType<MemberProfileListProps> = [
    {
      title: "S/N",
      key: "sn",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Membership Category",
      dataIndex: "membershipCategory",
      key: "membershipCategory",
      ...getColumnSearchProps("membershipCategory"),
    },
    {
      title: "Membership ID",
      dataIndex: "membershipID",
      key: "membershipID",
      ...getColumnSearchProps("membershipID"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        const memberLink = `https://www.app.cipmn.gov.ng/verified-member-profile/${record.membershipID}`;

        const handleCopyLink = async () => {
          try {
            await navigator.clipboard.writeText(memberLink);
            message.success("Link copied to clipboard!");
          } catch (err) {
            console.error("Copy failed:", err);
            message.error("Failed to copy link.");
          }
        };

        return (
          <Space>
            <Button
              icon={<DownloadOutlined />}
              onClick={() => handleDownload(record.id, record.membershipID)}
            >
              Download Barcode
            </Button>
            <Button onClick={handleCopyLink}>Copy Link</Button>
          </Space>
        );
      },
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("GUSER");
    window.location.href = "/login"; // Redirect to login page or homepage
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="w-full bg-white shadow p-4 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-2">
          <img
            src="/assets/logos/COAT_OF_ARM.jpeg"
            alt="Coat of Arms"
            className="w-14 h-14 object-cover rounded-full border"
          />
        </div>

        <div className="text-center flex-1">
          <h1 className="text-lg md:text-xl font-bold text-green-900">
            CHARTERED INSTITUTE OF PROJECT MANAGERS OF NIGERIA
          </h1>
          <p className="text-sm text-gray-600 font-semibold tracking-wide">
            (CIPMN)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <img
            src="/assets/logos/CIPMN.jpeg"
            alt="CIPMN Logo"
            className="w-14 h-14 object-cover rounded-full border"
          />
        </div>
      </header>
      <div className="text-xl font-semibold text-green-800 text-right mr-6 mt-2">
        <Button type="primary" danger onClick={handleLogout}>
          Logout
        </Button>
      </div>
      <div className="max-w-6xl mx-auto p-6">
        <Table<MemberProfileListProps>
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            onChange: (page, pageSize) => {
              setPagination({ current: page, pageSize });
            },
          }}
        />
      </div>
    </div>
  );
};
export default MembersProfile;
