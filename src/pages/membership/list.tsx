import React, { useEffect, useState, useRef } from "react";
import { Breadcrumb, Button, Input, Space, Table, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import type { InputRef, TableColumnsType, TableColumnType } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import { customDataProvider } from "../../providers/customDataProvider";
import { useDocumentTitle } from "@refinedev/react-router";

interface MembershipType {
  key: string;
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  membershipID: string;
}

type DataIndex = keyof MembershipType;

export const List = () => {
  const [data, setData] = useState<MembershipType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const navigate = useNavigate(); // For redirecting
  useDocumentTitle("Membership | CIPMN CRM");

  // Fetch Membership Records on Page Load
  useEffect(() => {
    const fetchMemberships = async () => {
      setLoading(true);
      try {
        const { data }: any = await customDataProvider.getList({
          resource: "membership",
          // pagination: { page: 1, perPage: 50 }, // Adjust pagination as needed
        });

        const formattedData = data.data.map((item: any) => ({
          key: item.id, // Unique key
          id: item.id,
          userId: item.userId,
          name: item.name,
          email: item.email,
          phone: item.phone,
          membershipID: item.membershipID,
        }));

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching membership data:", error);
        message.error("Failed to load membership records.");
      } finally {
        setLoading(false);
      }
    };

    fetchMemberships();
  }, []);

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
  ): TableColumnType<MembershipType> => ({
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

  //  Handle Edit
  const handleEdit = (id: string) => {
    navigate(`/membership/edit/${id}`); // Redirect to edit page
  };

  //  Handle Delete
  const handleDelete = async (id: string) => {
    try {
      // Find membership record based on ID
      const membershipRecord = data.find((item) => item.id === id);
      if (!membershipRecord) {
        throw new Error("Membership not found in local data.");
      }
      const userId = membershipRecord.userId;

      // Delete membership first
      const membershipDeleteResult = await customDataProvider.deleteOne({
        resource: "membership",
        id,
      });

      if (membershipDeleteResult?.data?.success) {
        // Then delete user
        await customDataProvider.deleteOne({
          resource: "users",
          id: userId,
        });

        // Only update UI if both deletions succeed
        message.success("Membership record deleted successfully!");
        setData((prevData) => prevData.filter((item) => item.id !== id));
      } else {
        throw new Error("Membership deletion failed.");
      }
    } catch (error: any) {
      console.error("Error deleting membership or user:", error);
      message.error(error?.message || "Failed to delete record.");
    }
  };

  // 🛠️ Table Columns Configuration
  const columns: TableColumnsType<MembershipType> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("email"),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Membership ID",
      dataIndex: "membershipID",
      key: "membershipID",
      ...getColumnSearchProps("membershipID"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.id)}
          />
          <Button
            type="link"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            danger
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Breadcrumb
        style={{ fontSize: "12px", textAlign: "left" }}
        items={[
          { title: <a href="/">Home</a> },
          { title: "> Membership List" },
        ]}
      />
      <div className="flex items-center justify-between gap-2 my-3">
        <h2 className="text-2xl text-[#14401D]">Membership List</h2>
        <div className="flex items-center gap-2">
          <Link
            to="/profile"
            className="px-2 py-1 text-xs text-[#1F5E29] font-semibold border border-[#1F5E29] rounded-md transition-all duration-300 hover:bg-[#f3f3f3]"
          >
            Profile List
          </Link>
          <Link
            to="/membership/create"
            className="px-2 py-1 text-xs text-white font-semibold bg-[#1F5E29] rounded-md transition-all duration-300 hover:bg-[#174a21] hover:shadow-lg"
            style={{ background: "#1F5E29", border: "none", color: "#fff" }}
          >
            Create Membership
          </Link>
        </div>
      </div>

      <Table<MembershipType>
        columns={columns}
        dataSource={data}
        loading={loading}
      />
    </div>
  );
};
